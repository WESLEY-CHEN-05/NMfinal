import pkg, { AliasAddress } from '@iota/sdk';
const { 
    Client, 
    SecretManager,
    Utils,
} = pkg;
import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    CoreDocument,
    Credential,
    EdDSAJwsVerifier,
    FailFast,
    IotaDocument,
    IotaIdentityClient,
    Jwk,
    JwkType,
    JwkMemStore,
    JwsAlgorithm,
    JwsSignatureOptions,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    KeyIdMemStore,
    MethodDigest,
    MethodRelationship,
    MethodScope,
    Service,
    Storage,
    Resolver,
    Timestamp,
    VerificationMethod,
} = pkg_id;

import { iotaResolution } from './iota_resolveDID.js';

import crypto from 'crypto';
import pkgx from 'elliptic';
const { eddsa } = pkgx;

const ec = new eddsa('ed25519');

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";
// const API_ENDPOINT = 

const FAUCET_ENDPOINT = "http://140.112.18.206:8091/api/enqueue";



export async function createDid(client, secretManager, storage){
    const didClient = new IotaIdentityClient(client);
    const networkHrp = await didClient.getNetworkHrp();

    const secretManagerInstance = new SecretManager(secretManager);
    const walletAddressBech32 = (await secretManagerInstance.generateEd25519Addresses({
        accountIndex: 0,
        range: {
            start: 0,
            end: 1,
        },
        bech32Hrp: networkHrp,
    }))[0];

    console.log("Wallet address Bech32:", walletAddressBech32);

    // await ensureAddressHasFunds(client, walletAddressBech32);
    console.log(await client.requestFundsFromFaucet(FAUCET_ENDPOINT, walletAddressBech32));

    const address = Utils.parseBech32Address(walletAddressBech32);
    console.log(address);

    // Create a new DID document with a placeholder DID.
    // The DID will be derived from the Alias Id of the Alias Output after publishing.
    const document = new IotaDocument(networkHrp);

    const fragment = await document.generateMethod(
        storage,
        JwkMemStore.ed25519KeyType(),
        JwsAlgorithm.EdDSA,
        "#jwk",
        MethodScope.AssertionMethod(),
    );

    // Construct an Alias Output containing the DID document, with the wallet address
    // set as both the state controller and governor.
    const aliasOutput = await didClient.newDidOutput(address, document);
    console.log("Alias Output:", JSON.stringify(aliasOutput, null, 2));
    
    // Publish the Alias Output and get the published DID document.
    const published = await didClient.publishDidOutput(secretManager, aliasOutput);
    console.log("Published DID document:", JSON.stringify(published, null, 2));

    return { address, document: published, fragment };
}


/**
 * This example shows how to create a Verifiable Credential and validate it.
 * In this example, Alice takes the role of the subject, while we also have an issuer.
 * The issuer signs a UniversityDegreeCredential type verifiable credential with Alice's name and DID.
 * This Verifiable Credential can be verified by anyone, allowing Alice to take control of it and share it with whomever they please.
 */
export async function createVC() {
    const client = new Client({
        primaryNode: API_ENDPOINT,
        localPow: true,
    });

    // Generate a random mnemonic for our wallet.
    const secretManager = {
        mnemonic: Utils.generateMnemonic(),
    };

    // Create an identity for the issuer with one verification method `key-1`.
    const issuerStorage = new Storage(new JwkMemStore(), new KeyIdMemStore());
    let { document: issuerDocument, fragment: issuerFragment } = await createDid(
        client,
        secretManager,
        issuerStorage,
    );

    console.log("SUCCESSFUL");

    // Create an identity for the holder, in this case also the subject.
    const aliceStorage = new Storage(new JwkMemStore(), new KeyIdMemStore());
    let { document: aliceDocument } = await createDid(
        client,
        secretManager,
        aliceStorage,
    );

    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const subject = {
        id: aliceDocument.id(),
        name: "Alice",
        degreeName: "Bachelor of Science and Arts",
        degreeType: "BachelorDegree",
        GPA: "4.0",
    };

    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = new Credential({
        id: "https://example.edu/credentials/3732",
        type: "UniversityDegreeCredential",
        issuer: issuerDocument.id(),
        credentialSubject: subject,
    });

    // Create signed JWT credential.
    const credentialJwt = await issuerDocument.createCredentialJwt(
        issuerStorage,
        issuerFragment,
        unsignedVc,
        new JwsSignatureOptions(),
    );
    console.log(`Credential JWT > ${credentialJwt.toString()}`);

    // Before sending this credential to the holder the issuer wants to validate that some properties
    // of the credential satisfy their expectations.

    // Validate the credential's signature, the credential's semantic structure,
    // check that the issuance date is not in the future and that the expiration date is not in the past.
    // Note that the validation returns an object containing the decoded credential.
    const decoded_credential = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
        credentialJwt,
        issuerDocument,
        new JwtCredentialValidationOptions(),
        FailFast.FirstError,
    );

    // Since `validate` did not throw any errors we know that the credential was successfully validated.
    console.log(`VC successfully validated`);

    // The issuer is now sure that the credential they are about to issue satisfies their expectations.
    // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
    console.log(`Issued credential: ${JSON.stringify(decoded_credential.intoCredential(), null, 2)}`);
}

createVC();