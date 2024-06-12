import pkg from '@iota/sdk';
const { 
    Client, 
} = pkg;
import pkg_id from "@iota/identity-wasm/node/index.js";
const {
    EdDSAJwsVerifier,
    FailFast,
    IotaIdentityClient,
    JwsVerificationOptions,
    Jwt,
    JwtCredentialValidationOptions,
    JwtCredentialValidator,
    JwtPresentationValidationOptions,
    JwtPresentationValidator,
    SubjectHolderRelationship,
    Resolver,
} = pkg_id;

// The API endpoint of an IOTA node, e.g. Hornet.
const API_ENDPOINT = "http://140.112.18.206:14265";

const sendData = (data, ws) =>{
    ws.send(JSON.stringify(data));
    // console.log('send data called in getFunc.');
}

export const validateVP = async (nonce, proofJwkString) => {

    try {

        const presentationJwt = new Jwt(proofJwkString);

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
        // return true;
        sendData(["validateVP", "true"], ws);

    } catch (error){
        console.log(error);
        sendData(["validateVP", "false"], ws);
    }
}

// // ================ SAMPLE USAGE ===================
// const nonce = "475a7984-1bb5-4c4c-a56f-822bccd46440";
// const proofJwkString = "eyJraWQiOiJkaWQ6aW90YTp0c3Q6MHhhZTAxMGI5ZGYzMjYxYTIzM2FjNTcyMjQ2Y2E5OGJkMDk4ZjQxNWNkMWI5NjExMTI5NjA2ZjE3YTAxMTFmNjJlI2tleS0xIiwidHlwIjoiSldUIiwibm9uY2UiOiI0NzVhNzk4NC0xYmI1LTRjNGMtYTU2Zi04MjJiY2NkNDY0NDAiLCJhbGciOiJFZERTQSJ9.eyJleHAiOjE3MTgwOTMxMjcsImlzcyI6ImRpZDppb3RhOnRzdDoweGFlMDEwYjlkZjMyNjFhMjMzYWM1NzIyNDZjYTk4YmQwOThmNDE1Y2QxYjk2MTExMjk2MDZmMTdhMDExMWY2MmUiLCJ2cCI6eyJAY29udGV4dCI6Imh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwidHlwZSI6IlZlcmlmaWFibGVQcmVzZW50YXRpb24iLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpyYVdRaU9pSmthV1E2YVc5MFlUcDBjM1E2TUhobVpHRXlPR0ppWmpnMk1tTTVaV1pqWWpZM1pERTJZMkU1T0RCaU16Y3dNMlF6WldWbE9ESTNaVGd5WkRVeVpEWmhPVGMzWVRVME5XVmpZakpsWmpWbUkydGxlUzB4SWl3aWRIbHdJam9pU2xkVUlpd2lZV3huSWpvaVJXUkVVMEVpZlEuZXlKcGMzTWlPaUprYVdRNmFXOTBZVHAwYzNRNk1IaG1aR0V5T0dKaVpqZzJNbU01WldaallqWTNaREUyWTJFNU9EQmlNemN3TTJRelpXVmxPREkzWlRneVpEVXlaRFpoT1RjM1lUVTBOV1ZqWWpKbFpqVm1JaXdpYm1KbUlqb3hOekU0TURnNU5ESXlMQ0pxZEdraU9pSm9kSFJ3Y3pvdkwzZDNkeTUwWVdsM1lXNTBZWGhwTG1OdmJTNTBkeThpTENKemRXSWlPaUprYVdRNmFXOTBZVHAwYzNRNk1IaGhaVEF4TUdJNVpHWXpNall4WVRJek0yRmpOVGN5TWpRMlkyRTVPR0prTURrNFpqUXhOV05rTVdJNU5qRXhNVEk1TmpBMlpqRTNZVEF4TVRGbU5qSmxJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPaUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNJc0luUjVjR1VpT2xzaVZtVnlhV1pwWVdKc1pVTnlaV1JsYm5ScFlXd2lMQ0pVWVhocFJISnBkbVZ5UTNKbFpHVnVkR2xoYkNKZExDSmpjbVZrWlc1MGFXRnNVM1ZpYW1WamRDSTZleUpzYVdObGJuTmxJam9pUTJWeWRHbG1hV1ZrSUZSaGVHa2dSSEpwZG1WeUlpd2libUZ0WlNJNklsZGxjMnhsZVNCRGFHVnVJbjE5ZlEuaWI4UkZCS3I2WWRkX0JNXzI1b0pfeTQyUnoxQjBwNjNuUWpMM3hEUDBFR25WN3pxSUxUaERheDJWRFVRVDdDZ2N0eERVVVIxbUZpaDRMQThCbEZQQ1EiXX19.9E-9Jftjt9mZ_kkswkyhV2jya7eXTCVKBXjZaSAhXBoeoF3VTVDqyEJZrjkxCZlMnt5539hx3vDbYWNsllujBA";

// validateVP(nonce, proofJwkString).then(() => process.exit()).catch(console.error);
// // ================ SAMPLE USAGE ===================