import { gql } from "@apollo/client";

export const EMAIL_LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
      token
      refreshToken
      user {
        _id
      }
    }
  }
`;
export const EMAIL_SIGNUP = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      ok
      errors {
        path
        message
      }
      user {
        _id
        email
      }
    }
  }
`;

export const ME_QUERY = gql`
  query($userUUID: String) {
    meQuery(userUUID: $userUUID) {
      ok
      errors {
        path
        message
      }
      user {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;
