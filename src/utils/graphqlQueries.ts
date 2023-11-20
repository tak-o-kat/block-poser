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

export const getBlockList = gql`
  query ($addy: String!, $start: ISO8601DateTime, $end: ISO8601DateTime) {
    algorand(network: algorand) {
      blocks(
        options: {desc: "height", limit: 10, offset: 0}
        date: {since: $start, till: $end}
        proposer: {is: $addy}
      ) {
        height
        timestamp {
          time(format: "%m-%d-%Y %H:%M:%S")
        }
        
      }
    }
  }
`;