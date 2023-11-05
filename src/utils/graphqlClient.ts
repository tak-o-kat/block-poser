import { GraphQLClient } from 'graphql-request'

const endpoint = `https://graphql.bitquery.io`;

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Api-Key': import.meta.env.VITE_API_KEY,
  },
})