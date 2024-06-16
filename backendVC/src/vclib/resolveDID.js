import pkg from '@iota/sdk';
const { 
    Client, 
} = pkg;
import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    CoreDocument,
    IotaDocument,
    IotaIdentityClient,
    Resolver,
} = pkg_id;

// Use this external package to avoid implementing the entire did:key method in this example.
import * as ed25519 from "@transmute/did-key-ed25519";

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

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
            console.log("Resolve", didKey, "successfully.");
            // console.log("Resolved DID Key document:", JSON.stringify(didKeyDoc, null, 2));
        } else {
            throw new Error(
                "the resolved document type should match the output type of keyHandler",
            );
        }

        // console.log("Resolving finished.");
        return didKeyDoc;

    } catch (error) {
        console.error("Error resolving DID:", error);
        // throw error; // Rethrow the error if you want it to propagate
        return null;
    }
}

// // ================ SAMPLE USAGE ===================
// const didKey = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f";

// console.log(await iotaResolution(didKey))
// process.exit();
// // ================ SAMPLE USAGE ===================