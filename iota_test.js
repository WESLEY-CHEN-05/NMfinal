import { writeFileSync, existsSync } from 'fs';

import pkg from '@iota/sdk';
const { Client, initLogger, StrongholdSecretManager, SecretManager } = pkg;

const API_ENDPOINT = "http://140.112.18.206:14265";

async function run() {

    console.log(Object.getOwnPropertyNames(Client.prototype));
    // 初始化日志记录器
    initLogger();

    // 创建一个新的客户端实例与 IOTA 分类帐交互
    const client = new Client({
        nodes: [API_ENDPOINT], // 指定连接的 IOTA 节点
        localPow: true, // 启用本地工作量证明
    });

    // 设置 Stronghold 文件的路径和密码
    const strongholdPath = './shibaloma.stronghold';
    const strongholdSecretManager = {
        stronghold: {
            snapshotPath: strongholdPath,          // 必须字段：Stronghold 文件的路径
            password: 'secure_password',           // 可选字段：用于加密 Stronghold 文件的密码
        }
    };


    try {
        // 检查 Stronghold 文件是否存在，并且如果不存在则创建一个新的 Stronghold 文件
        if (!existsSync(strongholdPath)) {
            // 生成随机助记符
            const mnemonic = await client.generateMnemonic();
            console.log('Generated mnemonic:', mnemonic);
            const hexedMnemonic = await client.mnemonicToHexSeed(mnemonic);
            console.log("Hexed", hexedMnemonic)
            // 将助记符存储到 Stronghold 文件中
            await client.storeMnemonic(strongholdSecretManager, hexedMnemonic);
            console.log('Mnemonic stored in Stronghold.');
        }


        // 预设一些配置用于生成地址
        const generateAddressesOptions = {
            accountIndex: 0,
            start: 0,
            end: 1,
        };

        // 使用 StrongholdSecretManager 生成新的地址
        // const addresses = await client.generateAddresses(strongholdSecretManager, generateAddressesOptions);
        // console.log('Generated address:', addresses[0]);

    } catch (error) {
        console.error('Error:', error);
    }
}

run().then(() => process.exit());