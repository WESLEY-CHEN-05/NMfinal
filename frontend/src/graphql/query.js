import { gql } from "@apollo/client";

export const GET_DRIVERS = gql`
  {
    getDrivers {
      id
      name
      age
    }
  }
`;

export const GET_DRIVER_BY_EMAIL = gql`
    query getDriverByEmail($email: String!) {
        getDriverByEmail(email: $email) {
            DIDid
            firstName
            lastName
            email
            password
            signedIn
        }
    }
`;

export const GET_DRIVER = gql`
    query getDriver($DIDid:String!){
        driver(DIDid:$ID){
            name
            signedIn
            email
        }
    }
`;