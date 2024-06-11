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