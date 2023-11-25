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

export const getBlocksProposed = gql`
  query ($addy: String!, $start: Datetime, $end: Datetime) {
    blocks(
      condition: {proposerAddr: $addy}
      filter: {realtime: {greaterThan: $start, lessThan: $end}}
    ) {
      totalCount
    }
  }
`;

export const getBlocksList = gql`
  query ($addy: String!, $start: Datetime, $end: Datetime) {
    blocks(
      first: 10
      condition: {proposerAddr: $addy}
      filter: {realtime: {greaterThan: $start, lessThan: $end}}
      orderBy: REALTIME_DESC
    ) {
      totalCount
      nodes {
        round
        realtime
      }
    }
  }
`;