import pkg from '@iota/sdk';
const { 
    Client, 
} = pkg;
import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    Duration,
    EdDSAJwsVerifier,
    FailFast,
    IotaIdentityClient,
    Jwk,
    JwkMemStore,
    JwsSignatureOptions,
    JwsVerificationOptions,
    Jwt,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    JwtPresentationOptions,
    JwtPresentationValidationOptions,
    JwtPresentationValidator,
    KeyIdMemStore,
    MethodDigest,
    Presentation,
    Storage,
    SubjectHolderRelationship,
    Resolver,
    Timestamp,
} = pkg_id;

import { iotaResolution } from './resolveDID.js';

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

export async function validateVP(nouce, subjectDID, subjectPrivateKey, subjectJwtString){

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

    // Create issuer Storage
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

    // Verifier receives the Verifiable Presentation and verifies it.
    const jwtPresentationValidationOptions = new JwtPresentationValidationOptions(
        {
            presentationVerifierOptions: new JwsVerificationOptions({ nonce }),
        },
    );

    const client = new Client({
        primaryNode: API_ENDPOINT,
        localPow: true,
    });
    const didClient = new IotaIdentityClient(client);

    const resolver = new Resolver({
        client: didClient,
    });

    // Resolve the presentation holder.
    const presentationHolderDID = JwtPresentationValidator.extractHolder(presentationJwt);
    const resolvedHolder = await resolver.resolve(
        presentationHolderDID.toString(),
    );

    // Validate presentation. Note that this doesn't validate the included credentials.
    let decodedPresentation = new JwtPresentationValidator(new EdDSAJwsVerifier()).validate(
        presentationJwt,
        resolvedHolder,
        jwtPresentationValidationOptions,
    );

    // Validate the credentials in the presentation.
    let credentialValidator = new JwtCredentialValidator(new EdDSAJwsVerifier());
    let validationOptions = new JwtCredentialValidationOptions({
        subjectHolderRelationship: [
            presentationHolderDID.toString(),
            SubjectHolderRelationship.AlwaysSubject,
        ],
    });

    let jwtCredentials = decodedPresentation
        .presentation()
        .verifiableCredential()
        .map((credential) => {
            const jwt = credential.tryIntoJwt();
            if (!jwt) {
                throw new Error("expected a JWT credential");
            } else {
                return jwt;
            }
        });

    // Concurrently resolve the issuers' documents.
    let issuers = [];
    for (let jwtCredential of jwtCredentials) {
        let issuer = JwtCredentialValidator.extractIssuerFromJwt(jwtCredential);
        issuers.push(issuer.toString());
    }
    let resolvedIssuers = await resolver.resolveMultiple(issuers);

    // Validate the credentials in the presentation.
    for (let i = 0; i < jwtCredentials.length; i++) {
        credentialValidator.validate(
            jwtCredentials[i],
            resolvedIssuers[i],
            validationOptions,
            FailFast.FirstError,
        );
    }

    // Since no errors were thrown we know that the validation was successful.
    console.log(`VP successfully validated`);
}

const nonce = "475a7984-1bb5-4c4c-a56f-822bccd46440";
const subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
const subjectPrivateKey = "Q3O9gmepFS6KAl5GpYs2CzZLeacfpZFdKU8JYPdf4Yg";
const credentialJwtString = "eyJraWQiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmI2tleS0xIiwidHlwIjoiSldUIiwiYWxnIjoiRWREU0EifQ.eyJpc3MiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmIiwibmJmIjoxNzE4MDg5NDIyLCJqdGkiOiJodHRwczovL3d3dy50YWl3YW50YXhpLmNvbS50dy8iLCJzdWIiOiJkaWQ6aW90YTp0c3Q6MHhhZTAxMGI5ZGYzMjYxYTIzM2FjNTcyMjQ2Y2E5OGJkMDk4ZjQxNWNkMWI5NjExMTI5NjA2ZjE3YTAxMTFmNjJlIiwidmMiOnsiQGNvbnRleHQiOiJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJUYXhpRHJpdmVyQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJsaWNlbnNlIjoiQ2VydGlmaWVkIFRheGkgRHJpdmVyIiwibmFtZSI6Ildlc2xleSBDaGVuIn19fQ.ib8RFBKr6Ydd_BM_25oJ_y42Rz1B0p63nQjL3xDP0EGnV7zqILThDax2VDUQT7CgctxDUUR1mFih4LA8BlFPCQ";

validateVP(nonce, subjectDID, subjectPrivateKey, credentialJwtString).then(() => process.exit()).catch(console.error);