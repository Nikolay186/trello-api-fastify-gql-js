import { GraphQLInputObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql'

export const CommentFilter = new GraphQLInputObjectType({
  name: 'CommentFilter',
  fields: {
    id: { type: GraphQLInt },
    ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    title: { type: GraphQLString },
    partContent: { type: GraphQLString },
    ownerId: { type: GraphQLInt },
    cardId: { type: GraphQLInt }
  }
})
