import { gql } from '@apollo/client';

export const ADD_DRIVER = gql`
  mutation AddDriver($firstName: String!, $lastName: String!) {
    addDriver(firstName: $firstName, lastName: $lastName) {
      ID
      firstName
      lastName
      signedIn
      email
    }
  }
`;