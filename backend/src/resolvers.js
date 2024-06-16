import { GraphQLError } from 'graphql';
import bcrypt from "bcrypt";
import CryptoJS from 'crypto-js';
import { validateDID } from "../../vclib/validateDID.js"

const saltRounds = 10;
const resolvers = {
  Query: {
    getDrivers: async (_, args, {DriverModel}) => await DriverModel.find(),
    getRandomDriver: async (_, args, {DriverModel}) => {
      const drivers = await DriverModel.find();
      const randomIndex = Math.floor(Math.random() * drivers.length);
      console.log(drivers)
      return drivers[randomIndex];
    },
    getDriverByDID: async (_, { DIDid }, { DriverModel }) => {
      try {
        const driver = await DriverModel.findById(DIDid);
        if (driver) return driver;
        throw new GraphQLError('Driver not found');
      } catch (e) {
        if (e instanceof GraphQLError) throw e;
        throw new GraphQLError(e.message);
      }
    },
  },
  Mutation: {
    addDriver: async(_, { DIDid, name, licenseNumber, dueDate, email }, { DriverModel })=>{
      try{
        const DIDisVaild = await validateDID(DIDid);
        if (!DIDisVaild) throw new GraphQLError("DIDid is not valid");
        const DIDExists = await DriverModel.findOne({DIDid});
        if (DIDExists) throw new GraphQLError("The DID has applied");        
        
        const driver = await new DriverModel({
          DIDid,
          name,
          licenseNumber,
          dueDate,
          email,
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