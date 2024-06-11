import { GraphQLError } from 'graphql';
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';
import { validateDID } from "../../vclib/validateDID.js"

const saltRounds = 10;
const resolvers = {
  Query: {
    getDrivers: async () => await find({}),
    getDriver: async (_, { DIDid }) => await findById(DIDid),
  },
  Mutation: {
    addDriver: async(_, { firstName, lastName, DIDid, password: ciphertext, email }, { DriverModel })=>{
      try{
        const emailExists = await DriverModel.findOne({email});
        if (emailExists) throw new GraphQLError("The email is used");
        const DIDisVaild = await validateDID(DIDid);
        if (!DIDisVaild) throw new GraphQLError("DIDid is not valid");
        
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