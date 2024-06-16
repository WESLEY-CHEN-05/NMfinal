import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PageProvider } from './hooks/usePage';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { WebsiteProvider } from './hooks/WebsiteContext';

const port = process.env.REACT_APP_MONGO_PORT || 5000;
console.log("PORT", port);

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: `http://localhost:${port}/graphql`, // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WebsiteProvider>
    <ApolloProvider client={client}>
      <PageProvider>
        <App />
      </PageProvider>
    </ApolloProvider>
    </WebsiteProvider>
  </React.StrictMode>
);

