// initializeClient.ts
import pkg from '@iota/sdk';
const { 
    Client, 
    SecretManager,
    Utils,
} = pkg;
import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    IotaDocument,
    IotaIdentityClient,
    JwkMemStore,
    JwsAlgorithm,
    KeyIdMemStore,
    MethodScope,
    Storage,
} = pkg_id;


import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

// The faucet endpoint allows requesting funds for testing purposes.
const FAUCET_ENDPOINT = "http://140.112.18.206:8091/api/enqueue";

/** Demonstrate how to create a DID Document and publish it in a new Alias Output. */
export async function createIdentity() {
    const client = new Client({
        primaryNode: API_ENDPOINT,
        localPow: true,
    });
    const didClient = new IotaIdentityClient(client);

    // Get the Bech32 human-readable part (HRP) of the network.
    const networkHrp = await didClient.getNetworkHrp();

    const mnemonicSecretManager = {
        mnemonic: Utils.generateMnemonic(),
    };

    // Generate a random mnemonic for our wallet.
    const secretManager = new SecretManager(mnemonicSecretManager);

    const walletAddressBech32 = (await secretManager.generateEd25519Addresses({
        accountIndex: 0,
        range: {
            start: 0,
            end: 1,
        },
        bech32Hrp: networkHrp,
    }))[0];
    console.log("Wallet address Bech32:", walletAddressBech32);

    console.log(await client.requestFundsFromFaucet(FAUCET_ENDPOINT, walletAddressBech32));

    // Request funds for the wallet, if needed - only works on development networks.
    // await ensureAddressHasFunds(client, walletAddressBech32);

    // Create a new DID document with a placeholder DID.
    // The DID will be derived from the Alias Id of the Alias Output after publishing.
    const document = new IotaDocument(networkHrp);
    const storage = new Storage(new JwkMemStore(), new KeyIdMemStore());

    // Insert a new Ed25519 verification method in the DID document.
    await document.generateMethod(
        storage,
        JwkMemStore.ed25519KeyType(),
        JwsAlgorithm.EdDSA,
        "#key-1",
        MethodScope.VerificationMethod(),
    );

    // Construct an Alias Output containing the DID document, with the wallet address
    // set as both the state controller and governor.
    console.log(walletAddressBech32);
    const address = Utils.parseBech32Address(walletAddressBech32);
    console.log(address);
    const aliasOutput = await didClient.newDidOutput(address, document);
    // console.log("Alias Output:", JSON.stringify(aliasOutput, null, 2));

    // Publish the Alias Output and get the published DID document.
    const published = await didClient.publishDidOutput(mnemonicSecretManager, aliasOutput);
    console.log("Published DID document:", JSON.stringify(published, null, 2));
}

await createIdentity();