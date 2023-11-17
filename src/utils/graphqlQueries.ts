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
  query ($addy: String!, $start: ISO8601DateTime, $end: ISO8601DateTime) {
    algorand (network: algorand) {
      blocks(
        proposer: {is: $addy}
        date: {since: $start, till: $end}
      ) {
        count
      }
    }
  }
`;