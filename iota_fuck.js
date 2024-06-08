import { Client, initLogger } from '@iota/sdk';

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

// The faucet endpoint allows requesting funds for testing purposes.
const FAUCET_ENDPOINT = "http://140.112.18.206:8091/api/enqueue";

// let stronghold_path = Path::new("/home/team3/shibaloma.stronghold");
// // Create a new secret manager backed by a Stronghold.
// let mut secret_manager: SecretManager = SecretManager::Stronghold(
//   StrongholdSecretManager::builder()
//     .password(Password::from("secure_password".to_owned()))
//     .build(stronghold_path)?,
// );

async function run() {
    initLogger();

    // Create a new client to interact with the IOTA ledger.
    const client = new Client({
        nodes: [API_ENDPOINT],
        localPow: true,
    });

    try {
        const nodeInfo = await client.getInfo();
        console.log('Node info: ', nodeInfo);
    } catch (error) {
        console.error('Error: ', error);
    }
}

run().then(() => process.exit());