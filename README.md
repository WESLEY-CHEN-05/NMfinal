# NMfinal
NM lab final project team 3

## Preparation
### IOTA Related
Please run the following command first.
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. "$HOME/.cargo/env"
```

### Install packages
Make sure you have run the command in [IOTA Related](#iota-related) block above. 
```
npm install
```

### Environment setting
Create an `.env` file (see `.env.example`). 
- `MNEMONIC`: fill a valid mnemonic. (generate using `mnemonic_generate.js`)
- `STRONGHOLD_PASSWORD`: fill in your stronghold password.
- `DID_EXAMPLE`: fill in one DID (used in `iota_updateDID.js, vc.js`), for example: `did:iota:tst:0xd67066081f03d61307a932ee2e757d2cbdd8a4a79b06eed21f2c9a390cbd04c5#key-1` (Don't use mine since you do not have my password! You can resolve it but cannot update it.)
- `DID_EXAMPLE_SUBJECT`: fill in one DID for the subject of VC.

### Run scripts
Simply run following command (modify `***.js` to the scripts you want to run).
``` 
node ***.js
```

---
## Scripts Introduction 
### resolve.js
Then you can see a new DID has been created and the corresponding DID document is printed. (See `DID_doc_example.txt` for an example.)

### mnemonic_generate.js
Generate a mnemonic (can use to fill the `MNEMONIC` field in `.env`).

### mnemonic_validate.js
Validate whether `MNEMONIC` in `.env` are valid.

### stronghold.js
Create stronghold file.

### iota_createDID.js
Can open a stronghold file, request funds, and create a DID.

### iota_resolveDID.js
Can resolve a did. (Default resolve DID of `DID_EXAMPLE` in `.env`.)

### iota_updateDID.js
Can update a did. (Default update DID of `DID_EXAMPLE` in `.env`.)

### iota_test*.js
Ignore it...

---
### Reference
- [IOTA-SDK Examples](https://github.com/iotaledger/iota-sdk/tree/develop/bindings/nodejs/examples)
- [Request Funds](https://wiki.iota.org/iota-sdk/how-tos/simple-transaction/request-funds/?language=typescript-node)
- [Create DID](https://wiki.iota.org/identity.rs/how-tos/decentralized-identifiers/create/)

### Note
- According to the [document](https://www.npmjs.com/package/@iota/sdk-wasm), use `@iota/sdk` instead of `@iota/sdk-wasm`, since the former supports stronghold while the other does not.