const {buildSchema} = require('graphql')

var schema = buildSchema(`
  type Query {
      user(username: String!): User
  }
  type User {
      id: Int!
      username: String
      email: String
  }
`)

module.exports = {
    schema
}