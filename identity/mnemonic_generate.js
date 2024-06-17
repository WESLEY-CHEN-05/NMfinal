import { Utils } from '@iota/sdk';
const newMnemonic = Utils.generateMnemonic();

console.log("Generated Mnemonic:", newMnemonic);

try {
    Utils.verifyMnemonic(newMnemonic);
    console.log("The generated mnemonic is valid.")
} catch (error) {
    console.log(error);
} 
