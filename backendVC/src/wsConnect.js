import { sendNonce } from './vclib/sendNonce.js';
import { challenge } from './vclib/challenge.js';
import { issueVC } from './vclib/issueVC.js';
import { validateDID } from './vclib/validateDID.js';
import { validateVC } from './vclib/validateVC.js';
import { validateVP } from './vclib/validateVP.js';

//helper functions
// const sendData = (data, ws) =>{
//     ws.send(JSON.stringify(data));
//     console.log('send data called. (in wsConnect.js, line 5)');
// }

const initData = (ws) => {
    console.log('data initialization called.');
}
const onMessage =  async (wss, ws, e) => {
        const [task, payload] = JSON.parse(e.data);
        switch (task) {
            case 'sendNonce':{
                sendNonce(payload.nonce, ws);
                break;
            }
            case 'challenge':{
                challenge(payload.nonce, payload.subjectDID, payload.subjectPrivateKey, payload.subjectJwtString, ws);
                break;
            }
            case 'issueVC':{
                // console.log("TEST", payload.issuerDID, payload.subjectDID, payload.subjectName, payload.jwkPrivateKey);
                issueVC(payload.issuerDID, payload.subjectDID, payload.subjectInfo, payload.jwkPrivateKey, ws);
                break;
            }
            case 'validateDID':{
                validateDID(payload.didKey, ws)
                break;
            }
            case 'validateVC':{
                validateVC(payload.issuerDID, payload.credentialJwtString, ws);
                break;
            }
            case 'validateVP':{
                validateVP(payload.nonce, payload.proofJwkString, ws);
                break;
            }
        }
    }


export { initData, onMessage };