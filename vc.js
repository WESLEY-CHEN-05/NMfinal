import pkg from '@iota/sdk';
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

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { iotaResolution } from './iota_resolveDID.js';

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

async function main(){

    // const issuerDID = process.env.DID_EXAMPLE;
    const issuerDID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f"
    const issuerDocument = await iotaResolution(issuerDID);

    const subjectDID = process.env.DID_EXAMPLE_SUBJECT;
    const subjectDocument = await iotaResolution(subjectDID);

    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const subject = {
        id: subjectDocument.id(),
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

    console.log("unsignedVC:", unsignedVc);

    // const [_did, issuerFragment] = issuerDID.split("#");
    const issuerFragment = "key-1";
    
    // ======================================
    // Storage problem
    // Create method Digest
    // console.log(issuerDocument.methods()[0]);
    const methodDigest = new MethodDigest(issuerDocument.methods()[0]);

    // without private key
    const _jwk_data = ((issuerDocument.methods()[0]).data().toJSON()).publicKeyJwk;
    // add private key (but how to access private key???)
    const jwk_data = {
        ..._jwk_data,
        // hardcode, think a way to store it.
        d: "paL-Ja24J4py_-xzvXXS3mVu53fJSc9VZPSViOTU-p8",
    };
    // console.log(jwk_data);

    // Create jwk object, JwkMemStore
    const jwk = new Jwk(jwk_data);
    const jwkstore = new JwkMemStore();

    // this will randomly generate a keyID
    const keyID = await jwkstore.insert(jwk);

    // create KeyIDdMemStore
    const keyidstore = new KeyIdMemStore();
    keyidstore.insertKeyId(methodDigest, keyID);

    // Create issuer Storage
    const issuerStorage = new Storage(jwkstore, keyidstore);
    // console.log(issuerStorage.keyIdStorage());
    // console.log(issuerStorage.keyStorage());
    // ======================================
    
    // Create signed JWT credential.
    console.log("FR", issuerFragment);

    // console.log("HI", issuerDocument.toJSON());
    console.log("HI", issuerDocument.toString());
    const credentialJwt = await issuerDocument.createCredentialJwt(
        issuerStorage,
        issuerFragment,
        unsignedVc,
        new JwsSignatureOptions(),
    );

    console.log(credentialJwt.toJSON());

    const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
        credentialJwt,
        issuerDocument,
        new JwtCredentialValidationOptions(),
        // FailFast.FirstError,
        FailFast.AllErrors,
    );
    console.log("credentialjwt validation", res.intoCredential());
}

main().then(() => process.exit()).catch(console.error);