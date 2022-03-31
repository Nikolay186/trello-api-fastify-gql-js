import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql'

export const CardFilter = new GraphQLInputObjectType({
  name: 'CardFilter',
  fields: {
    id: { type: GraphQLInt },
    ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    title: { type: GraphQLString },
    partTitle: { type: GraphQLString },
    columnId: { type: GraphQLInt },
    ownerId: { type: GraphQLInt }
  }
})
