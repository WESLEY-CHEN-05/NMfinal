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