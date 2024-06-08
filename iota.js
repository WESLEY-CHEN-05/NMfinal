// initializeClient.ts
import pkg from '@iota/sdk';
const { Client, SecretManagerType, SecretManager } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

// The faucet endpoint allows requesting funds for testing purposes.
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
async function getHRP(){
    const network_info = await iotaClient.getNetworkInfo();
    const bech32Hrp = network_info.protocolParameters.bech32Hrp;
    return bech32Hrp;
}

// ============================================================================
// Main
const secretManager = {
    stronghold: {
        snapshotPath: strongholdPath,
        password: password
    }
};

const iotaClient = new Client(clientOptions);

try{
    // open stronghold file
    const strongholdSecretManager = new SecretManager({
        stronghold: {
            password: process.env.STRONGHOLD_PASSWORD,
            snapshotPath: strongholdPath,
        },
    });

    const HRP = getHRP();

    // tailing [0] means that the return object is an array, we only need the first (only) entry
    const _address = await strongholdSecretManager.generateEd25519Addresses({
        accountIndex: 0,
        range: {
            start: 0,
            end: 1,
        },
        bech32Hrp: HRP,
    });
    const address = _address[0];
    console.log(address);

    // request funds for testing.
    console.log(await iotaClient.requestFundsFromFaucet(FAUCET_ENDPOINT, address));

} catch (error){
    console.log(error);
}