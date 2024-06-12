const sendData = (data, ws) =>{
    ws.send(JSON.stringify(data));
    // console.log('send data called in getFunc.');
}

export const sendNonce = async (nonce, ws) => {
    sendData(["sendNonce", nonce], ws);
}

// // ================ SAMPLE USAGE ===================
// const DID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f";

// console.log(await validateDID(DID));
// process.exit();
// // ================ SAMPLE USAGE ===================