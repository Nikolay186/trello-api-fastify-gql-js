import { schema } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/schema.js'
import setup from './src/db/connection.cjs'
import Fastify from 'fastify'
import mercurius from 'mercurius'
import graphql from 'graphql'
import jwt from 'jsonwebtoken'
import { User } from './src/models/user.js'

setup
const app = Fastify({
  // logger: true
})

app.register(mercurius, {
  schema,
  graphiql: true,
  queryDepth: 6,
  validationRules: [graphql.NoSchemaIntrospectionCustomRule],
  context: async (request, reply) => {
    return { request: request }
  }
})

app.listen(4000)
