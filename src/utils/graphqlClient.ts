import { GraphQLClient } from 'graphql-request'

const algoNodeEndpoint = `https://mainnet.lab.algorpc.pro/graphql`;

export const graphqlClient = new GraphQLClient(algoNodeEndpoint);