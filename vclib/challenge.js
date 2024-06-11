import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    Duration,
    Jwk,
    JwkMemStore,
    JwsSignatureOptions,
    Jwt,
    JwtPresentationOptions,
    KeyIdMemStore,
    MethodDigest,
    Presentation,
    Storage,
    Timestamp,
} = pkg_id;

import { iotaResolution } from './resolveDID.js';

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

export async function challenge(nonce, subjectDID, subjectPrivateKey, subjectJwtString){

    const subjectDocument = await iotaResolution(subjectDID);
    const subjectFragment = "key-1";

    // Create method Digest
    const subjectMethodDigest = new MethodDigest(subjectDocument.methods()[0]);

    const _subject_jwk_data = ((subjectDocument.methods()[0]).data().toJSON()).publicKeyJwk;
    const subject_jwk_data = {
        ..._subject_jwk_data,
        d: subjectPrivateKey,
    };

    // Create jwk object, JwkMemStore
    const subjectJwk = new Jwk(subject_jwk_data);
    const subjectJwkStore = new JwkMemStore();
    const subjectKeyID = await subjectJwkStore.insert(subjectJwk);

    // create KeyIDdMemStore
    const subjectKeyIDStore = new KeyIdMemStore();
    subjectKeyIDStore.insertKeyId(subjectMethodDigest, subjectKeyID);

    // Create subject Storage
    const subjectStorage = new Storage(subjectJwkStore, subjectKeyIDStore);

    // Set expire time
    const expires = Timestamp.nowUTC().checkedAdd(Duration.minutes(10));

    // Create a Verifiable Presentation from the Credential
    const credentialJwt = new Jwt(subjectJwtString);
    const unsignedVp = new Presentation({
        holder: subjectDocument.id(),
        verifiableCredential: [credentialJwt],
    });

    // Create a JWT verifiable presentation using the holder's verification method
    // and include the requested challenge and expiry timestamp.
    const presentationJwt = await subjectDocument.createPresentationJwt(
        subjectStorage,
        subjectFragment,
        unsignedVp,
        new JwsSignatureOptions({ nonce }),
        new JwtPresentationOptions({ expirationDate: expires }),
    );

    // console.log(presentationJwt.toString());
    
    console.log("Challenge completed.");

    return (presentationJwt.toString());
}

// // ================ SAMPLE USAGE ===================
// const nonce = "475a7984-1bb5-4c4c-a56f-822bccd46440";
// const subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
// const subjectPrivateKey = "Q3O9gmepFS6KAl5GpYs2CzZLeacfpZFdKU8JYPdf4Yg";
// const credentialJwtString = "eyJraWQiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmI2tleS0xIiwidHlwIjoiSldUIiwiYWxnIjoiRWREU0EifQ.eyJpc3MiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmIiwibmJmIjoxNzE4MDg5NDIyLCJqdGkiOiJodHRwczovL3d3dy50YWl3YW50YXhpLmNvbS50dy8iLCJzdWIiOiJkaWQ6aW90YTp0c3Q6MHhhZTAxMGI5ZGYzMjYxYTIzM2FjNTcyMjQ2Y2E5OGJkMDk4ZjQxNWNkMWI5NjExMTI5NjA2ZjE3YTAxMTFmNjJlIiwidmMiOnsiQGNvbnRleHQiOiJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJUYXhpRHJpdmVyQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJsaWNlbnNlIjoiQ2VydGlmaWVkIFRheGkgRHJpdmVyIiwibmFtZSI6Ildlc2xleSBDaGVuIn19fQ.ib8RFBKr6Ydd_BM_25oJ_y42Rz1B0p63nQjL3xDP0EGnV7zqILThDax2VDUQT7CgctxDUUR1mFih4LA8BlFPCQ";

// console.log(await challenge(nonce, subjectDID, subjectPrivateKey, credentialJwtString));
// process.exit();
// // ================ SAMPLE USAGE ===================