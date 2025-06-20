import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
    uri: 'http://192.168.0.102:4000/graphql',
  });  

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
