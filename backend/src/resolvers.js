import { GraphQLError } from 'graphql';
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';
import { validateDID } from "../../vclib/validateDID.js"
import PassengerModel from './model/Passenger.js';

const saltRounds = 10;
const resolvers = {
  Query: {
    getDrivers: async (_, args, {DriverModel}) => await DriverModel.find(),
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
    getPassengerByEmail: async(_, {email}, {PassengerModel})=>{
      try{
          const passenger = await PassengerModel.findOne({email});
          if (passenger) return passenger;
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
    addPassenger: async(_, { firstName, lastName, password: ciphertext, email }, { PassengerModel })=>{
      try{
        const emailExists = await PassengerModel.findOne({email});
        if (emailExists) throw new GraphQLError("The email is used");
        
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'NMfinalalalala');
        const password = bytes.toString(CryptoJS.enc.Utf8);
        // console.log({name, password, email});
        const hash = await bcrypt.hash(password, saltRounds)
          // Store hash in your password DB.
        const passenger = await new PassengerModel({
              firstName,
              lastName,
              password: hash,
              email,
              signedIn: false,
            }).save();
        return passenger;
      }catch(e){
        if(e instanceof GraphQLError)throw e;
        throw new GraphQLError(e);
      }
    },
    updateSignedIn:async(_,{identity, state, email, password:ciphertext}, {DriverModel, PassengerModel})=>{
      try{
        let person;
        console.log(email);
        console.log(identity);
        if (identity === "driver") person = await DriverModel.findOne({email});
        else if (identity === "passenger") person = await PassengerModel.findOne({email});
        if(!person) throw new GraphQLError(`account not found`);
        console.log(person);
        if(!state){//sign out
          person.signedIn = state;
          await person.save();
          return person.name
        }
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'NMfinalalalala');
        const password = bytes.toString(CryptoJS.enc.Utf8);
    
        const result = await bcrypt.compare(password, person.password);
        if(!result)throw new GraphQLError(`The password is not correct`);
        person.signedIn = state;
        await person.save();
        return person.firstName;
  
      }catch(e){
        if(e instanceof GraphQLError)throw e;
        throw new GraphQLError(e);
      }
    },
  },
};

export default resolvers;