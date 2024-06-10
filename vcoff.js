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

// Define IClientOptions
const clientOptions = {
    nodes: [API_ENDPOINT], // provide an API endpoint to connect to IOTA node
    // localPow: true
};

// stronghold configuration
const strongholdPath = 'client.stronghold';
const password = process.env.STRONGHOLD_PASSWORD;

// ============================================================================
// Functions
// Get the Bech32 human-readable part (HRP) of the network.
async function getHRP(iotaClient){
    const network_info = await iotaClient.getNetworkInfo();
    const bech32Hrp = network_info.protocolParameters.bech32Hrp;
    return bech32Hrp;
}

// ============================================================================
// Main


try{
    const iotaClient = new Client(clientOptions);
    const didClient = new IotaIdentityClient(iotaClient);

    const strongholdConfig = {
        stronghold: {
            password: password,
            snapshotPath: strongholdPath,
        },
    };
    // open stronghold file
    const strongholdSecretManager = new SecretManager(strongholdConfig);

    const networkHrp = await getHRP(iotaClient);

    const walletAddressBech32 = (await strongholdSecretManager.generateEd25519Addresses({
        accountIndex: 0,
        range: {
            start: 0,
            end: 1,
        },
        bech32Hrp: networkHrp,
    }))[0];
    console.log(walletAddressBech32);
    
    // request funds for testing.
    // console.log(await iotaClient.requestFundsFromFaucet(FAUCET_ENDPOINT, walletAddressBech32));


    // Create DID
    const document = new IotaDocument(networkHrp);
    const storage = new Storage(new JwkMemStore(), new KeyIdMemStore());

    // Insert a new Ed25519 verification method in the DID document.
    const fragment = await document.generateMethod(
        storage,
        JwkMemStore.ed25519KeyType(),
        JwsAlgorithm.EdDSA,
        "#key-1",
        MethodScope.VerificationMethod(),
    );

    console.log(storage.keyIdStorage());
    console.log(storage.keyStorage());
    // console.log(document);

    // document.setMetadataCreated(Timestamp.nowUTC());
    // document.setMetadataUpdated(Timestamp.nowUTC());

    // Construct an Alias Output containing the DID document, with the wallet address
    // set as both the state controller and governor.
    const address = Utils.parseBech32Address(walletAddressBech32);
    const aliasOutput = await didClient.newDidOutput(address, document);
    console.log("Alias Output:", JSON.stringify(aliasOutput, null, 2));
    
    // Publish the Alias Output and get the published DID document.
    const published = await didClient.publishDidOutput(strongholdConfig, aliasOutput);
    console.log("Published DID document:", JSON.stringify(published, null, 2));

    
    // Create DID for Alice
    const documentA = new IotaDocument(networkHrp);
    const storageA = new Storage(new JwkMemStore(), new KeyIdMemStore());

    // Insert a new Ed25519 verification method in the DID document.
    await documentA.generateMethod(
        storageA,
        JwkMemStore.ed25519KeyType(),
        JwsAlgorithm.EdDSA,
        "#key-1",
        MethodScope.VerificationMethod(),
    );

    console.log(storageA.keyIdStorage());
    console.log(storageA.keyStorage());
    // console.log(document);

    // document.setMetadataCreated(Timestamp.nowUTC());
    // document.setMetadataUpdated(Timestamp.nowUTC());

    // Construct an Alias Output containing the DID document, with the wallet address
    // set as both the state controller and governor.
    const addressA = Utils.parseBech32Address(walletAddressBech32);
    const aliasOutputA = await didClient.newDidOutput(addressA, document);
    console.log("Alias Output:", JSON.stringify(aliasOutput, null, 2));
    
    // Publish the Alias Output and get the published DID document.
    const publishedA = await didClient.publishDidOutput(strongholdConfig, aliasOutputA);
    console.log("Published DID document:", JSON.stringify(publishedA, null, 2));

        // Create a credential subject indicating the degree earned by Alice, linked to their DID.
        const subject = {
            id: documentA.id(),
            name: "Alice",
            degreeName: "Bachelor of Science and Arts",
            degreeType: "BachelorDegree",
            GPA: "4.0",
        };
    
        // Create an unsigned `UniversityDegree` credential for Alice
        const unsignedVc = new Credential({
            id: "https://example.edu/credentials/3732",
            type: "UniversityDegreeCredential",
            issuer: document.id(),
            credentialSubject: subject,
        });
    
        // Create signed JWT credential.
        const credentialJwt = await document.createCredentialJwt(
            storage,
            fragment,
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
            document,
            new JwtCredentialValidationOptions(),
            FailFast.FirstError,
        );
    
        // Since `validate` did not throw any errors we know that the credential was successfully validated.
        console.log(`VC successfully validated`);
    
        // The issuer is now sure that the credential they are about to issue satisfies their expectations.
        // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
        console.log(`Issued credential: ${JSON.stringify(decoded_credential.intoCredential(), null, 2)}`);

} catch (error){
    console.log(error);
}