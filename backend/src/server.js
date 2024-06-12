import { createServer } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'fs';
import resolvers from './resolvers.js';
import connectDB from './mongo.js'; // Import the database connection function
import DriverModel from './model/Driver.js';
import PassengerModel from './model/Passenger.js';

// Initialize the database connection
connectDB();

const typeDefs = readFileSync('./src/graphql/schema.graphql', 'utf8');

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: {
    DriverModel,
    PassengerModel,
  }
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(5000, () => {
  console.info('Server is running on http://localhost:5000/graphql')
})