import { gql } from 'graphql-request'

export const findBalance = gql`
  query ($addy: String!) {
    algorand{
      address(address: {is: $addy}){
        balance
      }
    }
  }
`;

export const getBlockCount = gql`
`;