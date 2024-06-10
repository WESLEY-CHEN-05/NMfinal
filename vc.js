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
    const issuerDID = "did:iota:tst:0x7959e706614bb57bfb63c429f48039031a3ea678edcc08787370fe535fd72e10#key-1";
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

    console.log(unsignedVc);

    const [_did, issuerFragment] = issuerDID.split("#");
    // console.log(_did);
    
    // ======================================
    // Storage problem
    // Create method Digest
    // console.log(issuerDocument.methods()[0]);
    const methodDigest = new MethodDigest(issuerDocument.methods()[0]);

    // for testing (see key_id_storage.js)
    // let arrayBuffer = methodDigest.pack().buffer;
    // let buffer = Buffer.from(arrayBuffer);
    // console.log(buffer.toString("base64"));

    // without private key
    const _jwk_data = ((issuerDocument.methods()[0]).data().toJSON()).publicKeyJwk;
    // add private key (but how to access private key???)
    const jwk_data = {
        ..._jwk_data,
        d: "FPaWZpT9v8pyJp5urN-bH-mFi7yJyaXrlyJP9g2AHds",
    };
    // console.log(jwk_data);

    // Create jwk object
    const jwk = new Jwk(jwk_data);
    // console.log(jwk);

    // create JwkMemStore
    const jwkstore = new JwkMemStore();
    // this will randomly generate a keyID
    const keyID = await jwkstore.insert(jwk);
    // console.log(keyID);
    // console.log(jwkstore);

    // create KeyIDdMemStore
    const keyidstore = new KeyIdMemStore();
    keyidstore.insertKeyId(methodDigest, keyID);
    // console.log(keyidstore);

    // Create issuer Storage
    const issuerStorage = new Storage(jwkstore, keyidstore);
    // console.log(issuerStorage);
    // console.log(issuerStorage.keyIdStorage());
    // console.log(issuerStorage.keyStorage());
    // ======================================
    
    // Create signed JWT credential.
    const credentialJwt = await issuerDocument.createCredentialJwt(
        issuerStorage,
        issuerFragment,
        unsignedVc,
        new JwsSignatureOptions(),
    );

    console.log(credentialJwt);

    // const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
    //     credentialJwt,
    //     issuerDocument,
    //     new JwtCredentialValidationOptions(),
    //     FailFast.FirstError,
    // );
    // console.log("credentialjwt validation", res.intoCredential());
}

main().then(() => process.exit()).catch(console.error);