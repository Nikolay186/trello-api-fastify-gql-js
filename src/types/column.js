import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { CardType } from './card.js'
import { UserType } from './user.js'
import { getCardLoader } from '../dataloaders/cardLoader.js'
import { getUserLoader } from '../dataloaders/userLoader.js'

export const ColumnType = new GraphQLObjectType({
  name: 'Column',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLInt) },
    cards: {
      type: new GraphQLList(new GraphQLNonNull(CardType)),
      resolve: async (source) => {
        const loader = getCardLoader(source)
        return loader.load(source.id)
      }
    },
    owner: {
      type: new GraphQLNonNull(UserType),
      resolve: async (source) => {
        const loader = getUserLoader(source)
        return loader.load(source.ownerId)
      }
    }
  })
})

export const CreateColumnInput = new GraphQLInputObjectType({
  name: 'CreateColumn',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) }
  }
})

export const UpdateColumnInput = new GraphQLInputObjectType({
  name: 'UpdateColumn',
  fields: {
    title: { type: GraphQLString },
    ownerId: { type: GraphQLInt }
  }
})
