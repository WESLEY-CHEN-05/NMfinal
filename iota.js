import clientPkg from '@iota/client';
import identityPkg from '@iota/identity-wasm/node/index.js';

const { Client, SingleNodeClient } = clientPkg;
const { resolveDid, createIdentityClient } = identityPkg;

// API and Faucet Endpoints
const API_ENDPOINT = 'http://140.112.18.206:14265';
const FAUCET_ENDPOINT = 'http://140.112.18.206:8091/api/enqueue';

// Stronghold path and password
const STRONGHOLD_PATH = '/home/team3/shibaloma.stronghold';
const STRONGHOLD_PASSWORD = 'secure_password';

// Create a new client to interact with the IOTA ledger
// const client = new Client({
//     nodes: ['https://api.testnet.shimmer.network'],
//     localPow: true,
// });

async function run() {
    // initLogger();

    const client = new Client({
        nodes: [API_ENDPOINT],
        localPow: true,
    });

    try {
        const nodeInfo = await client.getInfo();
        console.log('Node info: ', nodeInfo);

        // 示例：如何使用 resolveDid 和 createIdentityClient
        const identityClient = createIdentityClient();
        const didDocument = await resolveDid(identityClient, "did:iota:456789");
        console.log('DID Document: ', didDocument);
    } catch (error) {
        console.error('Error: ', error);
    }
}

run().then(() => process.exit()).catch(err => {
    console.error('Unhandled Error: ', err);
    process.exit(1);
});




// async function main() {
//   try {
//     // Get an address with funds for testing
//     const address = await getAddressWithFunds(client, FAUCET_ENDPOINT);

//     console.log(`Address: ${address}`);

//     // Get the Bech32 human-readable part (HRP) of the network
//     const networkName = await client.getInfo().then(info => info.network);

//     // Create a new DID document with a placeholder DID
//     const identityClient = await createIdentityClient({ network: networkName });
//     const { keypair, document } = await identityClient.create({ network: networkName });

//     console.log(`Generated DID Document: ${JSON.stringify(document.toJSON(), null, 2)}`);

//     // Insert a new Ed25519 verification method in the DID document
//     document.addKey({
//       id: `${document.id}#signingKey`,
//       type: 'Ed25519VerificationKey2018',
//       controller: document.id,
//       publicKeyBase58: keypair.public,
//     });

//     // Publish the Alias Output and get the published DID document
//     const aliasOutput = await client.newAliasOutput({
//       address,
//       document,
//     });

//     const publishedDocument = await identityClient.publish({ aliasOutput });
//     console.log(`Published DID Document: ${JSON.stringify(publishedDocument.toJSON(), null, 2)}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//   }
// }

// // Helper function to get an address with funds
// async function getAddressWithFunds(client, faucetEndpoint) {
//   // Get a new address
//   const address = await client.getAddresses('seed').next();
  
//   // Request funds from the faucet
//   await sendFundsToAddress(faucetEndpoint, address);

//   return address;
// }

// // Helper function to send funds to an address
// async function sendFundsToAddress(faucetEndpoint, address) {
//   const response = await fetch(faucetEndpoint, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ address: address }),
//   });

//   if (!response.ok) throw new Error('Failed to request funds from faucet');
// }

// main();