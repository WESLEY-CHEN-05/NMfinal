import { createServer } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'fs';
import resolvers from './resolvers.js';
import connectDB from './mongo.js'; // Import the database connection function
import DriverModel from './model/Driver.js';
import dotenv from 'dotenv-defaults';

dotenv.config();
// Initialize the database connection
connectDB();

const typeDefs = readFileSync('./src/graphql/schema.graphql', 'utf8');

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: {
    DriverModel
  }
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
const port = process.env.PORT || 5000;
 
// Start the server and you're done!
server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/graphql`)
})