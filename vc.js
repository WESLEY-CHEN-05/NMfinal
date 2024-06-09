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

// import { iotaResolution } from './iota_resolveDID.js';

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

// ===================================== 
// RESOLVE FUNCTION
import * as ed25519 from "@transmute/did-key-ed25519";

// Demonstrates how to set up a resolver using custom handlers.
export async function iotaResolution(didKey) {
    
    // Set up a handler for resolving Ed25519 did:key
    const keyHandler = async function(didKey){
        let document = await ed25519.resolve(
            didKey,
            { accept: "application/did+ld+json" },
        );
        return CoreDocument.fromJSON(document.didDocument);
    };

    // Create a new Client to interact with the IOTA ledger.
    const client = new Client({
        primaryNode: API_ENDPOINT,
        localPow: true,
    });
    const didClient = new IotaIdentityClient(client);

    // Construct a Resolver capable of resolving the did:key and iota methods.
    let handlerMap = new Map();
    handlerMap.set("key", keyHandler);

    const resolver = new Resolver(
        {
            client: didClient,
            handlers: handlerMap,
        },
    );

    try{
        // Resolve didKey into a DID document.
        const didKeyDoc = await resolver.resolve(didKey);

        // Check that the types of the resolved documents match our expectations:
        // console.log(didKeyDoc.constructor.name);
    
        if (didKeyDoc instanceof IotaDocument) {
            console.log("Resolved DID Key document:", JSON.stringify(didKeyDoc, null, 2));
        } else {
            throw new Error(
                "the resolved document type should match the output type of keyHandler",
            );
        }

        console.log("Resolving finished.");
        return didKeyDoc;

    } catch (error) {
        console.error("Error resolving DID:", error);
        throw error; // Rethrow the error if you want it to propagate
    }
}
// ====================================================



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

    const issuerStorage = new Storage(new JwkMemStore(), new KeyIdMemStore());
    const [_did, issuerFragment] = issuerDID.split("#");
    console.log(_did);

    console.log(issuerStorage.keyIdStorage());

    const methodDigest = new MethodDigest(new VerificationMethod(_did));
    // const methodDigest = new MethodDigest(MethodScope.VerificationMethod());

    // Create signed JWT credential.
    try{
        const credentialJwt = await issuerDocument.createCredentialJwt(
            issuerStorage,
            issuerFragment,
            unsignedVc,
            new JwsSignatureOptions(),
        );
    } catch (error){
        console.error("Error creating JWT credential: ", error);
    }


    // const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
    //     credentialJwt,
    //     issuerDocument,
    //     new JwtCredentialValidationOptions(),
    //     FailFast.FirstError,
    // );
    // console.log("credentialjwt validation", res.intoCredential());

}

main().then(() => process.exit()).catch(console.error);