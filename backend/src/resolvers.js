import { GraphQLError } from 'graphql';
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';

const resolvers = {
  Query: {
    getDrivers: async () => await find({}),
    getDriver: async (_, { DIDid }) => await findById(DIDid),
  },
  Mutation: {
    addDriver: async(_, { firstName, lastName, DIDid, password: ciphertext, email }, { DriverModel })=>{
      try{
        const p = await PlayerModel.findOne({email});
        if(p)throw new GraphQLError(`USED-EMAIL:The email = ${email} has been used`);
    
        
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'NMfinalalalala');
        const password = bytes.toString(CryptoJS.enc.Utf8);
        // console.log({name, password, email});
        const hash = await bcrypt.hash(password, saltRounds)
          // Store hash in your password DB.
        const driver = await new DriverModel({
              DIDid,
              firstName,
              lastName,
              password: hash,
              email,
              signedIn: false,
            }).save();
        return driver;
      }catch(e){
        if(e instanceof GraphQLError)throw e;
        throw new GraphQLError(e);
      }
    },
  },
};

export default resolvers;