import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

export const UserFilter = new GraphQLInputObjectType({
  name: 'UserFilter',
  fields: {
    id: { type: GraphQLInt },
    ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    partUsername: { type: GraphQLString },
    partEmail: { type: GraphQLString },
  },
})
