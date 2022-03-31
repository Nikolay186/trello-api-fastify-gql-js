import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

export const ColumnFilter = new GraphQLInputObjectType({
  name: 'ColumnFilter',
  fields: {
    id: { type: GraphQLInt },
    ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    title: { type: GraphQLString },
    partTitle: { type: GraphQLString },
    ownerId: { type: GraphQLInt }
  }
})
