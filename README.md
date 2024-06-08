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
- `MNEMONIC`: fill a valid mnemonic. (see [how to generate](#mnemonic_generate.js))
- `STRONGHOLD_PASSWORD`: fill in your stronghold password.

### Run scripts
Simply run following command (modify `***.js` to the scripts you want to run).
``` 
node ***.js
```

---
## Scripts Introduction 
### `resolve.js`
Then you can see a new DID has been created and the corresponding DID document is printed. (See `DID_doc_example.txt` for an example.)

### `mnemonic_generate.js`
Generate a mnemonic (can use to fill the `MNEMONIC` field in `.env`).

### `mnemonic.validate.js`
Validate whether `MNEMONIC` in `.env` are valid.

### `stronghold.js`
Create stronghold file.

### `iota_**.js`
Still under development...