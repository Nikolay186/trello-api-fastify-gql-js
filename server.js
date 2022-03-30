import { schema } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/schema.js'
import setup from './src/db/connection.cjs'
import Fastify from 'fastify'
import mercurius from 'mercurius'
import { findUser } from './src/auth/jwt.js'
import graphql from 'graphql'

setup
const app = Fastify({
  logger: true
})

app.register(mercurius, {
  schema,
  graphiql: true,
  queryDepth: 6,
  validationRules: [graphql.NoSchemaIntrospectionCustomRule],
  context: async (request, reply) => {
    const user = await findUser(request.headers.authorization)
    if (user === undefined) {
      reply.status(404).send({
        message: 'User not found',
        type: 'NOT_FOUND',
        data: { }
      })
    } else { return user }
  }
})

app.listen(4000)
