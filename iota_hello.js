// initializeClient.ts
import pkg from '@iota/sdk';
const { Client, SecretManagerType } = pkg;

// 定義 IClientOptions
const clientOptions = {
    nodes: ['https://api.lb-0.testnet.chrysalis2.com'] // 提供一個 API 端點來連接到 IOTA 節點
};

// stronghold 的配置
const strongholdPath = 'stronghold_database'; // 在當前目錄創建 stronghold 文件
const password = 'your-stronghold-password'; // stronghold 密碼

const secretManager = {
    stronghold: {
        snapshotPath: strongholdPath,
        password: password
    }
};

// 初始化 IOTA 客戶端
const iotaClient = new Client(clientOptions);

// 確保 stronghold 初始化
async function initializeStronghold() {
    try {
        // 呼叫初始化 stronghold 方法
        await iotaClient.methodHandler.callMethod({
            name: 'initStronghold',
            data: {
                snapshotPath: strongholdPath,
                password: password,
            },
        });

        console.log('Stronghold initialized successfully.');

    } catch (error) {
        console.error('Error initializing Stronghold:', error);
    }
}

// 初始化 stronghold 並運行一些測試操作
async function run() {
    await initializeStronghold();
    
    // 在這裡你可以進一步使用 iotaClient 完成其他操作，比如生成地址、發送交易等
    // const newAddress = await iotaClient.generateAddresses({ ... });
    // console.log('Generated new address:', newAddress);
}

run();