import Driver from './model/Driver.js';

const resolvers = {
  Query: {
    getPeople: async () => await find({}),
    getPerson: async (_, { id }) => await findById(id),
  },
  Mutation: {
    addPerson: async (_, { name, age }) => {
      const newPerson = new Driver({ name, age });
      await newPerson.save();
      return newPerson;
    },
  },
};

export default resolvers;