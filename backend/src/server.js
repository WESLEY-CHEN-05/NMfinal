import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { readFileSync } from 'fs';
import resolvers from './resolvers.js';
import connectDB from './mongo.js'; // Import the database connection function

// Initialize the database connection
connectDB();

const typeDefs = readFileSync('./src/graphql/schema.graphql', 'utf8');

const yoga = createYoga({
  schema: {
    typeDefs,
    resolvers,
  },
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})