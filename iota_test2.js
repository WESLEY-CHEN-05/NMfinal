import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  Jwk,
  JwkType,
  EdCurve,
  MethodScope,
  IotaDocument,
  VerificationMethod,
  Service,
  MethodRelationship,
  IotaIdentityClient,
  DocumentBatch,
  Indexation,
  ProofType,
} = require('@iota/identity-wasm/node');
const { Client, SecretManagerType } = require('@iota/sdk-wasm/node');

const EXAMPLE_JWK = new Jwk({
  kty: JwkType.Okp,
  crv: EdCurve.Ed25519,
  x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
});

// The endpoint of the IOTA node to use.
const API_ENDPOINT = "http://140.112.18.206:14265";

// Secret manager for key management
const secretManager = {
//   type: SecretManagerType.String, 
  secret: "your-iota-secret-key" // Replace this with your actual secret key or appropriate secret manager
};

// async function generateNewAddress(client) {
//   const address = await client.generateAddresses(
//     secretManager,
//     { startIndex: 0, count: 1, bech32: true }
//   );
//   return address[0];
// }

/** Demonstrate how to create a DID Document. */
async function main() {
  // Create a new client with the given network endpoint.
  const client = new Client({
    primaryNode: API_ENDPOINT,
    localPow: true,
  });

  const didClient = new IotaIdentityClient(client);

  // Get the Bech32 human-readable part (HRP) of the network.
  const networkHrp = await didClient.getNetworkHrp();

  // Create a new DID document with a placeholder DID.
  // The DID will be derived from the Alias Id of the Alias Output after publishing.
  const document = new IotaDocument(networkHrp);

  // Insert a new Ed25519 verification method in the DID document.
  const method = VerificationMethod.newFromJwk(
    document.id(),
    EXAMPLE_JWK,
    "#key-1"
  );
  document.insertMethod(method, MethodScope.VerificationMethod());

  // Attach a new method relationship to the existing method.
  document.attachMethodRelationship(
    document.id().join("#key-1"),
    MethodRelationship.Authentication
  );

  // Add a new Service.
  const service = new Service({
    id: document.id().join("#linked-domain"),
    type: "LinkedDomains",
    serviceEndpoint: "https://iota.org/",
  });
  document.insertService(service);

  console.log(`Created document before resolve: `, JSON.stringify(document.toJSON(), null, 2));

//   const address = await generateNewAddress(didClient); // Awaiting this function

//   // Create a new DID AliasOutput
//   const aliasOutput = await didClient.newDidOutput(address, document);

//   // Publish the DID Document
//   const publishedDocument = await didClient.publishDidOutput(secretManager, aliasOutput);

//   console.log(`Published document: `, JSON.stringify(publishedDocument.toJSON(), null, 2));

//   // Fetching the published DID Document from the network to display it.
//   const did = publishedDocument.id().toString();
//   const resolvedDocument = await didClient.resolveDid(did);

//   console.log(`Resolved document: `, JSON.stringify(resolvedDocument.toJSON(), null, 2));
}

main();