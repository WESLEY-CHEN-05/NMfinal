import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { fromString as uint8ArrayFromString } from 'uint8arrays';
import { randomBytes } from 'crypto';

// input: 32-byte long Uint8Array, output: an DID id
async function getDIDId(seed) {
  try {
    const did = await authenticateDID(seed);
    return did.id;
  } catch (error) {
    console.error('Authenticated DID failed:', error);
    return null;
  }
}

// `seed` must be a 32-byte long Uint8Array
async function authenticateDID(seed) {
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  return did;
}

// resolve a DID using did string
async function resolveDID(didstring) {
  const did = new DID({ resolver: getResolver() });
  try {
    const doc = await did.resolve(didstring);
    console.log(JSON.stringify(doc, null, 2));
    return doc;
  } catch (error) {
    console.error("Error generated when resolving DID: ", error);
  }
}

// update a DID
async function updateDID(didString) {
  // const did = await authenticateDID();

  const currentDoc = await resolveDID(didString);

  if (!currentDoc) {
    throw new Error('Failed to resolve DID document');
  }

  // update, for example, add "service" entry
  const updatedDoc = {
    ...currentDoc,
    service: [
      ...(currentDoc.service || []),
      {
        id: `${didString}#updated-service`,
        type: 'MessagingService',
        serviceEndpoint: 'https://example.com/updated-service',
      },
    ],
  };

  // sign updated files??
  // const signedUpdate = await did.createJWS(updatedDoc);

  // add to registry file, block???
  // console.log('Signed DID Document Update:', signedUpdate);
  
  // return signedUpdate;
  console.log("Update Result:");
  console.log(updatedDoc);
  return updatedDoc;
}

async function main() {
  // const seed = randomBytes(32);  // generate 32 bytes random seed

  // use constant seed
  const fixedSeedString = "a very secure seed used for testing purposes";
  // fill to 32 bytes (to meet the requirement)
  const paddedString = fixedSeedString.padEnd(32, ' ');
  const truncatedString = paddedString.slice(0, 32);
  const fixedSeed = uint8ArrayFromString(truncatedString, 'utf-8');
  
  const didId = await getDIDId(fixedSeed);

  if (didId) {
    console.log(`DID: ${didId}`);
    resolveDID(didId);
    updateDID(didId); 
  }
}

main();