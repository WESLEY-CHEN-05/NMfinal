import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    Credential,
    EdDSAJwsVerifier,
    FailFast,
    Jwk,
    JwkMemStore,
    JwsSignatureOptions,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    KeyIdMemStore,
    MethodDigest,
    Storage,
} = pkg_id;

import { iotaResolution } from './resolveDID.js';

class AnyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResolveError';
    }
}

const sendData = (data, ws) =>{
    // console.log(JSON.stringify(data));
    ws.send(JSON.stringify(data));
    // console.log('send data called in getFunc.');
}

export const issueVC = async (issuerDID, subjectDID, subjectInfo, jwkPrivateKey, ws) => {

    try{
        const issuerDocument = await iotaResolution(issuerDID);
        if (!issuerDocument) throw new AnyError("Invalid DID for issuer.");
        const subjectDocument = await iotaResolution(subjectDID);
        if (!subjectDocument) throw new AnyError("Invalid DID for issuer.");

        // Create a credential subject indicating the degree earned by Alice, linked to their DID.
        const subject = {
            ...subjectInfo,
            id: subjectDocument.id(),
            license: "Certified Taxi Driver",
        };

        // Create an unsigned `UniversityDegree` credential for Alice
        const unsignedVc = new Credential({
            id: "https://www.taiwantaxi.com.tw",
            type: "TaxiDriverCredential",
            issuer: issuerDocument.id(),
            credentialSubject: subject,
        });

        console.log(unsignedVc);

        const issuerFragment = "key-1";

        const methodDigest = new MethodDigest(issuerDocument.methods()[0]);
        const _jwk_data = ((issuerDocument.methods()[0]).data().toJSON()).publicKeyJwk;
        const jwk_data = {
            ..._jwk_data,
            d: jwkPrivateKey,
        };

        const jwk = new Jwk(jwk_data);
        const jwkstore = new JwkMemStore();
        const keyID = await jwkstore.insert(jwk);

        const keyidstore = new KeyIdMemStore();
        keyidstore.insertKeyId(methodDigest, keyID);

        const issuerStorage = new Storage(jwkstore, keyidstore);

        // console.log(unsignedVc);

        // Create signed JWT credential.
        const credentialJwt = await issuerDocument.createCredentialJwt(
            issuerStorage,
            issuerFragment,
            unsignedVc,
            new JwsSignatureOptions(),
        );

        // console.log(credentialJwt.toJSON());

        const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
            credentialJwt,
            issuerDocument,
            new JwtCredentialValidationOptions(),
            FailFast.FirstError,
        );
        // console.log("credentialjwt validation", res.intoCredential());

        console.log("Issue VC sucessfully!");
        
        sendData(["issueVC", credentialJwt.toString()], ws);
        // return credentialJwt.toString();
    } catch (error) {
        console.log("ERR", error);
        if (error instanceof AnyError){
            sendData(["issueVC", `ERROR: ${error.message}`], ws);
        }
        else {
            sendData(["issueVC", `ERROR: Wrong Jwt Key.`], ws);
        }
        
    }
}

// // ================ SAMPLE USAGE ===================
// const issuerDID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f";
// const subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
// const privateKey = "paL-Ja24J4py_-xzvXXS3mVu53fJSc9VZPSViOTU-p8";
// const name = "Wesley Chen";

// const jwtCredential = await issueVC(issuerDID, subjectDID, name, privateKey);
// console.log(jwtCredential);
// process.exit();
// // ================ SAMPLE USAGE ===================