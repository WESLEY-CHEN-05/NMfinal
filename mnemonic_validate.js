import { Utils } from '@iota/sdk';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Check if the mnemonic in .env is valid
try {
    Utils.verifyMnemonic(process.env.MNEMONIC);
    console.log("The generated mnemonic is valid.")
} catch (error) {
    console.log(error);
} 
