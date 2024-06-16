//test datas for frontend testing//
//////////////////////////////////
import client from './wsConnect.js'


const sendData =  async (data) => {
    if(client.readyState === client.OPEN){
        await client.send(JSON.stringify(data));
        //console.log('data send. data:', JSON.stringify(data));
    }
};

const useBackend = () => {

    const sendNonce = (nonce) => {
        const argument = {
            nonce,
        }
        sendData(["sendNonce", argument]);
    }

    const challenge = async (nonce, subjectDID, subjectPrivateKey, subjectJwtString) => {
        const argument = {
            nonce, 
            subjectDID, 
            subjectPrivateKey, 
            subjectJwtString,
        }
        await sendData(["challenge", argument]);
    };

    const issueVC = (argument) => {
        /*
        argument = {
            
            JwtKey,
            due
        }
        */
        sendData(["issueVC", argument]);
    };

    // const resolveDID = (didKey) => {
    //     const argument = {
    //         didKey,
    //     }
    //     sendData(["resolveDID", argument]);
    // }

    const validateDID = (didKey) => {
        const argument = {
            didKey,
        }
        sendData(["validateDID", argument]);
    }

    const validateVC = (issuerDID, credentialJwtString) => {
        const argument = {
            issuerDID, 
            credentialJwtString,
        }
        sendData(["validateVC", argument]);
    }

    const validateVP = (nonce, proofJwkString) => {
        const argument = {
            nonce,
            proofJwkString,
        }
        sendData(["validateVP", argument]);
    }

    return {
        sendNonce, challenge, issueVC, validateDID, validateVC, validateVP
    };
};

export { useBackend };

//sendData(["AddUser",{name:name, address:address}]);