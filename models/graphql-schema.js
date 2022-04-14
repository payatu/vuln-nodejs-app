const {buildSchema} = require('graphql')

var schema = buildSchema(`
  type Query {
      user(username: String!): User
      listUsers: [Users]
      showProfile(userid: Int!): User
  }

  type User {
      username: String
      email: String
  }

  type Users {
      username: String
      email: String
  }

  type Mutation {
      updateProfile(username: String, email: String, password: String!): String
  }
`)

module.exports = {
    schema
}