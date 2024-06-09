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
    JwkMemStore,
    JwsAlgorithm,
    JwsSignatureOptions,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    KeyIdMemStore,
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

    const issuerDID = process.env.DID_EXAMPLE;
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

    // const issuerStorage = new Storage(new JwkMemStore(), new KeyIdMemStore());
    // const [_did, issuerFragment] = issuerDID.split("#");

    // // Create signed JWT credential.
    // const credentialJwt = await issuerDocument.createCredentialJwt(
    //     issuerStorage,
    //     issuerFragment,
    //     unsignedVc,
    //     new JwsSignatureOptions(),
    // );

    // const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
    //     credentialJwt,
    //     issuerDocument,
    //     new JwtCredentialValidationOptions(),
    //     FailFast.FirstError,
    // );
    // console.log("credentialjwt validation", res.intoCredential());

}

main().catch(console.error);