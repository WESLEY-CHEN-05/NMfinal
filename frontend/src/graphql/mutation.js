import { gql } from '@apollo/client';

export const ADD_DRIVER = gql`
  mutation AddDriver($DIDid: ID!, $name:String!, $licenseNumber: String!, $dueDate: String!, $email: String!) {
    addDriver(DIDid: $DIDid, name: $name, licenseNumber: $licenseNumber, dueDate:$dueDate, email: $email) {
      DIDid
      name
      licenseNumber
      dueDate
      email
    }
  }
`;