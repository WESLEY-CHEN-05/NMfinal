import { gql } from "@apollo/client";

export const GET_DRIVERS = gql`
  query getDrivers{
    getDrivers {
      DIDid
      firstName
      lastName
      email
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
export const GET_PASSENGER_BY_EMAIL = gql`
    query getPassengerByEmail($email: ID!) {
        getPassengerByEmail(email: $email) {
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