import { schema } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/schema.js'
import setup from './src/db/connection.cjs'
import Fastify from 'fastify'
import mercurius from 'mercurius'

setup
const app = Fastify({
  logger: true
})

app.register(mercurius, {
  schema,
  graphiql: true
})

app.listen(4000)
