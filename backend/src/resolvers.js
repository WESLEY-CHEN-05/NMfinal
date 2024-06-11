import Driver from './model/Driver.js';

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
    
        let newid = uuidv4();
        while(await PlayerModel.findOne({ID:newid})){
            newid = uuidv4();
        };
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'webProgramming123');
        const password = bytes.toString(CryptoJS.enc.Utf8);
        // console.log({name, password, email});
        const hash = await bcrypt.hash(password, saltRounds)
          // Store hash in your password DB.
        const player = await new DriverModel({
              DIDid,
              firstName,
              lastName,
              password:hash,
              email,
              signedIn:false,
            }).save();
        return player;
      }catch(e){
        if(e instanceof GraphQLError)throw e;
        throw new GraphQLError(e);
      }
    },
  },
};

export default resolvers;