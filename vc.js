import pkg from '@iota/sdk';
const { 
    Client, 
    SecretManager,
    Utils,
} = pkg;
import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    CoreDocument,
    Credential,
    Duration,
    EdDSAJwsVerifier,
    FailFast,
    IotaDocument,
    IotaIdentityClient,
    Jwk,
    JwkType,
    JwkMemStore,
    JwsAlgorithm,
    JwsSignatureOptions,
    JwsVerificationOptions,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    JwtPresentationOptions,
    JwtPresentationValidationOptions,
    JwtPresentationValidator,
    KeyIdMemStore,
    MethodDigest,
    MethodRelationship,
    MethodScope,
    Presentation,
    Service,
    Storage,
    SubjectHolderRelationship,
    Resolver,
    Timestamp,
    VerificationMethod,
} = pkg_id;

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { iotaResolution } from './iota_resolveDID.js';

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

async function main(){

    // const issuerDID = process.env.DID_EXAMPLE;
    const issuerDID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f"
    const issuerDocument = await iotaResolution(issuerDID);

    // const subjectDID = process.env.DID_EXAMPLE_SUBJECT;
    // const subjectDID = "did:iota:tst:0xd212c12870617317073cf6859d517d5d6024372a772f88a43bb9d0e933de744d"
    const subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
    const subjectDocument = await iotaResolution(subjectDID);

    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const subject = {
        id: subjectDocument.id(),
        name: "Alice",
        degreeName: "Bachelor of Science and Arts",
        degreeType: "BachelorDegree",
        GPA: "4.0",
    };

    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = new Credential({
        id: "https://example.edu/credentials/3732",
        type: "UniversityDegreeCredential",
        issuer: issuerDocument.id(),
        credentialSubject: subject,
    });

    console.log("unsignedVC:", unsignedVc);

    // const [_did, issuerFragment] = issuerDID.split("#");
    const issuerFragment = "key-1";
    const subjectFragment = "key-1";
    
    // ======================================
    // Storage problem
    // Create method Digest
    // console.log(issuerDocument.methods()[0]);
    const methodDigest = new MethodDigest(issuerDocument.methods()[0]);

    // without private key
    const _jwk_data = ((issuerDocument.methods()[0]).data().toJSON()).publicKeyJwk;
    // add private key (but how to access private key???)
    const jwk_data = {
        ..._jwk_data,
        // hardcode, think a way to store it.
        d: "paL-Ja24J4py_-xzvXXS3mVu53fJSc9VZPSViOTU-p8",
    };
    // console.log(jwk_data);

    // Create jwk object, JwkMemStore
    const jwk = new Jwk(jwk_data);
    const jwkstore = new JwkMemStore();

    // this will randomly generate a keyID
    const keyID = await jwkstore.insert(jwk);

    // create KeyIDdMemStore
    const keyidstore = new KeyIdMemStore();
    keyidstore.insertKeyId(methodDigest, keyID);

    // Create issuer Storage
    const issuerStorage = new Storage(jwkstore, keyidstore);
    // console.log(issuerStorage.keyIdStorage());
    // console.log(issuerStorage.keyStorage());
    // ======================================
    
    // ======================================
    // subject storage
        // Storage problem
    // Create method Digest
    // console.log(issuerDocument.methods()[0]);
    const subjectMethodDigest = new MethodDigest(subjectDocument.methods()[0]);

    // without private key
    const _jwk_data_sub = ((subjectDocument.methods()[0]).data().toJSON()).publicKeyJwk;
    // add private key (but how to access private key???)
    const jwk_data_sub = {
        ..._jwk_data_sub,
        // hardcode, think a way to store it.
        d: "Q3O9gmepFS6KAl5GpYs2CzZLeacfpZFdKU8JYPdf4Yg",
    };

    // Create jwk object, JwkMemStore
    const jwk_sub = new Jwk(jwk_data_sub);
    const jwkstore_sub = new JwkMemStore();

    // this will randomly generate a keyID
    const keyID_sub = await jwkstore_sub.insert(jwk_sub);

    // create KeyIDdMemStore
    const keyidstore_sub = new KeyIdMemStore();
    keyidstore_sub.insertKeyId(subjectMethodDigest, keyID_sub);

    // Create issuer Storage
    const subjectStorage = new Storage(jwkstore_sub, keyidstore_sub);
    console.log("DEBUG");
    console.log(subjectStorage.keyIdStorage());
    console.log(subjectStorage.keyStorage());
    // =========================================
    
    // Create signed JWT credential.
    console.log("FR", issuerFragment);

    // console.log("HI", issuerDocument.toJSON());
    console.log("HI", issuerDocument.toString());
    const credentialJwt = await issuerDocument.createCredentialJwt(
        issuerStorage,
        issuerFragment,
        unsignedVc,
        new JwsSignatureOptions(),
    );

    console.log(credentialJwt.toJSON());

    const res = new JwtCredentialValidator(new EdDSAJwsVerifier()).validate(
        credentialJwt,
        issuerDocument,
        new JwtCredentialValidationOptions(),
        // FailFast.FirstError,
        FailFast.AllErrors,
    );
    console.log("credentialjwt validation", res.intoCredential());

    // ===========================================================================
    // Step 3: Issuer sends the Verifiable Credential to the holder.
    // ===========================================================================

    // The credential is then serialized to JSON and transmitted to the holder in a secure manner.
    // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
    console.log(`Sending credential (as JWT) to the holder`, unsignedVc.toJSON());

    // ===========================================================================
    // Step 4: Verifier sends the holder a challenge and requests a signed Verifiable Presentation.
    // ===========================================================================

    // A unique random challenge generated by the requester per presentation can mitigate replay attacks.
    const nonce = "475a7984-1bb5-4c4c-a56f-822bccd46440";

    // The verifier and holder also agree that the signature should have an expiry date
    // 10 minutes from now.
    const expires = Timestamp.nowUTC().checkedAdd(Duration.minutes(10));

    // ===========================================================================
    // Step 5: Holder creates a verifiable presentation from the issued credential for the verifier to validate.
    // ===========================================================================

    // Create a Verifiable Presentation from the Credential
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

    // ===========================================================================
    // Step 6: Holder sends a verifiable presentation to the verifier.
    // ===========================================================================
    console.log(
        `Sending presentation (as JWT) to the verifier`,
        unsignedVp.toJSON(),
    );

    // ===========================================================================
    // Step 7: Verifier receives the Verifiable Presentation and verifies it.
    // ===========================================================================

    // The verifier wants the following requirements to be satisfied:
    // - JWT verification of the presentation (including checking the requested challenge to mitigate replay attacks)
    // - JWT verification of the credentials.
    // - The presentation holder must always be the subject, regardless of the presence of the nonTransferable property
    // - The issuance date must not be in the future.

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

main().then(() => process.exit()).catch(console.error);