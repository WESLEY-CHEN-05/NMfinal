import { gql } from "@apollo/client";

export const GET_DRIVERS = gql`
  query getDrivers{
    getDrivers {
      DIDid
      name
      licenseNumber
      dueDate
      email
    }
  }
`;

export const GET_DRIVER_BY_DID = gql`
    query getDriverByDID($DIDid: String!) {
        getDriverByDID(DIDid: $DIDid) {
            DIDid
            name
            licenseNumber
            dueDate
            email
        }
    }
`;