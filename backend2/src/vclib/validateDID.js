import { iotaResolution } from './resolveDID.js';

const sendData = (data, ws) =>{
    ws.send(JSON.stringify(data));
    // console.log('send data called in getFunc.');
}

export const validateDID = async (DID) => {
    try {
        await iotaResolution(DID);
        sendData(["validateDID", "true"], ws);
    } catch {
        sendData(["validateDID", "false"], ws);
    }
}

// // ================ SAMPLE USAGE ===================
// const DID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f";

// console.log(await validateDID(DID));
// process.exit();
// // ================ SAMPLE USAGE ===================