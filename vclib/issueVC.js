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

export async function issueVC(issuerDID, subjectDID, subjectName, jwkPrivateKey){

    try{
        const issuerDocument = await iotaResolution(issuerDID);
        const subjectDocument = await iotaResolution(subjectDID);

        // Create a credential subject indicating the degree earned by Alice, linked to their DID.
        const subject = {
            id: subjectDocument.id(),
            name: subjectName,
            license: "Certified Taxi Driver",
        };

        // Create an unsigned `UniversityDegree` credential for Alice
        const unsignedVc = new Credential({
            id: "https://www.taiwantaxi.com.tw",
            type: "TaxiDriverCredential",
            issuer: issuerDocument.id(),
            credentialSubject: subject,
        });

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

        return credentialJwt.toString();
    } catch {
        return "ISSUE ERROR";
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