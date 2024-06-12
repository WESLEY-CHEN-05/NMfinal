import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PageProvider } from './hooks/usePage';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <PageProvider>
        <App />
      </PageProvider>
    </ApolloProvider>
  </React.StrictMode>
);

