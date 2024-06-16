import { useContext, createContext, useState, useEffect } from 'react'
import client from './wsConnect'
import { gridFilterActiveItemsLookupSelector } from '@mui/x-data-grid';

const WebsiteContext = createContext({
    nonce: "",
    credentialJwt: "",
    presentationJwt: "",
    didValid: false,
    VCValid: false,
    VPValid: false,
})

const WebsiteProvider = (props) => {
    const [nonce, setNonce] = useState("");
    const [credentialJwt, setCredentialJwt] = useState("");
    const [presentationJwt, setPresentationJwt] = useState("");
    const [didValid, setDidValid] = useState(false);
    const [VCValid, setVCValid] = useState(false);
    const [VPValid, setVPValid] = useState(false);

    client.onmessage = (byteString) => {
        const {data} = byteString;
        const [task, payload] = JSON.parse(data);
        switch (task){
            case "sendNonce":{
                setNonce(payload);
                break;
            }
            case "challenge":{
                setPresentationJwt(payload);
                break;
            }
            case "issueVC":{
                console.log("ISSUED!!!");
                setCredentialJwt(payload);
                break;
            }
            case "validateDID":{
                setDidValid((payload === "true") ? true : false);
                break;
            }
            case "validateVC":{
                setVCValid((payload === "true") ? true : false);
                break;
            }
            case "validateVP":{
                setVPValid((payload === "true") ? true : false);
                break;
            }
            default : break;
        }
    }

    return (
        <WebsiteContext.Provider
            value={{
                nonce, setNonce, credentialJwt, setCredentialJwt, presentationJwt, setPresentationJwt, didValid, VCValid, VPValid, 
            }}
            {...props}
        />
    );
};

const useWebsite = ()=>useContext(WebsiteContext);
export { WebsiteProvider, useWebsite }