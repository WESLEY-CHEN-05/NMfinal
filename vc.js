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

import crypto from 'crypto';
import pkgx from 'elliptic';
const { eddsa } = pkgx;

const ec = new eddsa('ed25519');

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

async function main(){

    // const issuerDID = process.env.DID_EXAMPLE;
    // const issuerDID = "did:iota:tst:0x7959e706614bb57bfb63c429f48039031a3ea678edcc08787370fe535fd72e10#key-1";
    const issuerDID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f#key-1"
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
    const __jwk_data = {
        ..._jwk_data,
        // d: "FPaWZpT9v8pyJp5urN-bH-mFi7yJyaXrlyJP9g2AHds",
        d: "paL-Ja24J4py_-xzvXXS3mVu53fJSc9VZPSViOTU-p8",
        // d: ec.keyFromPublic(_jwk_data.x),
    };
    // console.log(jwk_data);
    console.log(__jwk_data);

    const keyPair = ec.keyFromSecret(__jwk_data.d);
    // const keyPair = ec.keyFromSecret('NiIRq_YRvewUy8PcR54QnAnzvRuvi0AKGnc1N0KP69A');
    const generatedPublicKey = keyPair.getPublic('hex');
    
    const jwk_data = {
        ...__jwk_data,
        x: generatedPublicKey,
    }
    
    // if (generatedPublicKey !== 'NXgOohR4ogxS8R3-sPXIMbm0auRLWRZcWXeD_vR8R9M'){
        // console.log(generatedPublicKey);
    if (generatedPublicKey !== jwk_data.x) {
        console.log("HIHI", generatedPublicKey, "WQ");
        console.log("HIHI", jwk_data.x, "WQ");
        console.error("私鑰和公鑰不匹配！");
    } else {
        console.log("私鑰和公鑰匹配！");
    }

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
    console.log(issuerStorage.keyIdStorage());
    console.log(issuerStorage.keyStorage());
    // ======================================
    
    // Create signed JWT credential.
    const credentialJwt = await issuerDocument.createCredentialJwt(
        issuerStorage,
        issuerFragment,
        unsignedVc,
        new JwsSignatureOptions(),
    );

    console.log(credentialJwt);
    console.log(credentialJwt.toJSON());

    const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
        credentialJwt,
        issuerDocument,
        new JwtCredentialValidationOptions(),
        FailFast.FirstError,
    );
    console.log("credentialjwt validation", res.intoCredential());
}

main().then(() => process.exit()).catch(console.error);