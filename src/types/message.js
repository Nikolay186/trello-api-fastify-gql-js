import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

export const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: {
    message: { type: new GraphQLNonNull(GraphQLString) }
  }
})
