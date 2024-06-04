import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { randomBytes } from 'crypto';

// `seed` must be a 32-byte long Uint8Array
async function authenticateDID(seed) {
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  return did;
}

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

async function main() {
  const seed = randomBytes(32);  // 生成一個 32 字節長的隨機種子
  const didId = await getDIDId(seed);

  if (didId) {
    console.log(`DID: ${didId}`);
    resolveDID(didId);
  }
}

main();