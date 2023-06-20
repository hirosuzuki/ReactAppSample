import { graphql } from "@/generated";

export const AuthQuery = graphql(/* GraphQL */ `
  query Auth($username: String!, $password: String!) {
    auth(username: $username, password: $password)
  }
`);
