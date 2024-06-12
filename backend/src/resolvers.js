import { GraphQLError } from 'graphql';
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';
import { validateDID } from "../../vclib/validateDID.js"

const saltRounds = 10;
const resolvers = {
  Query: {
    getDrivers: async () => await find({}),
    getDriver: async (_, { DIDid }) => await findById(DIDid),
    getDriverByEmail: async(_, {email}, {DriverModel})=>{
      try{
          const driver = await DriverModel.findOne({email});
          if (driver) return driver;
          throw new GraphQLError('email not found');
      }catch(e){
          if(e instanceof GraphQLError) throw e;
          throw new GraphQLError(e);
      }
    },
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
    updateSignedIn:async(_,{identity, state, email, password:ciphertext}, {DriverModel})=>{
      try{
        let person;
        console.log(email)
        if (identity === "driver") person = await DriverModel.findOne({email});
        if(!person) throw new GraphQLError(`account not found`);
    
        if(!state){//sign out
          person.signedIn = state;
          await person.save();
          return person
        }
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'NMfinalalalala');
        const password = bytes.toString(CryptoJS.enc.Utf8);
    
        const result = await bcrypt.compare(password, person.password);
        if(!result)throw new GraphQLError(`The password is not correct`);
        person.signedIn = state;
        await person.save();
        return person;
  
      }catch(e){
        if(e instanceof GraphQLError)throw e;
        throw new GraphQLError(e);
      }
    },
  },
};

export default resolvers;