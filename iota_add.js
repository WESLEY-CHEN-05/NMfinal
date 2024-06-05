import { Client, initLogger, SecretManager } from '@iota/client';

async function run() {
    initLogger();

    const client = new Client({
        nodes: ['https://api.testnet.shimmer.network'],
        localPow: true,
    });

    try {
        const nodeInfo = await client.getInfo();
        console.log('Node info: ', nodeInfo);

        // 使用有效的助记符
        const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        const secretManager = new SecretManager({
            mnemonic: mnemonic
        });

        // 使用SecretManager生成地址
        const addresses = await client.generateAddresses(secretManager, {
            accountIndex: 0,
            start: 0,
            end: 1
        });
        console.log('Generated address: ', addresses[0]);

    } catch (error) {
        console.error('Error: ', error);
    }
}

run().then(() => process.exit());