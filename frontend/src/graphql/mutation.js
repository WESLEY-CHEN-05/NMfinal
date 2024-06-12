import { gql } from '@apollo/client';

export const ADD_DRIVER = gql`
  mutation AddDriver($firstName: String!, $lastName: String!, $DIDid: ID!, $email: String!, $password: String!) {
    addDriver(firstName: $firstName, lastName: $lastName, DIDid: $DIDid, email: $email, password: $password) {
      firstName
      lastName
      DIDid
      email
      password
    }
  }
`;
export const ADD_ISSUER = gql`
  mutation AddIssuer($firstName: String!, $lastName: String!, $DIDid: ID!, $email: String!, $password: String!) {
    addIssuer(firstName: $firstName, lastName: $lastName, DIDid: $DIDid, email: $email, password: $password) {
      firstName
      lastName
      DIDid
      email
      password
    }
  }
`;
export const ADD_PASSENGER = gql`
  mutation AddPassenger($firstName: String!, $lastName: String!, $email: ID!, $password: String!) {
    addPassenger(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      firstName
      lastName
      email
      password
    }
  }
`;

export const UPDATESIGNEDIN_MUTATION = gql`
    mutation updateSignedIn($identity:String!, $state:Boolean!, $email:String!, $password:String!){
        updateSignedIn(identity:$identity, state:$state, email:$email, password:$password)
    }
`;