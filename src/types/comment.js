import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { CardType } from './card.js'
import { UserType } from './user.js'
import { getUserLoader } from '../dataloaders/userLoader.js'
import { getCardLoader } from '../dataloaders/cardLoader.js'

export const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLInt) },
    cardId: { type: new GraphQLNonNull(GraphQLInt) },
    owner: {
      type: new GraphQLNonNull(UserType),
      resolve: async (source) => {
        const loader = getUserLoader(source)
        return loader.load(source.ownerId)
      }
    },
    card: {
      type: new GraphQLNonNull(CardType),
      resolve: async (source) => {
        const loader = getCardLoader(source)
        return loader.load(source.cardId)
      }
    }
  })
})

export const CreateCommentInput = new GraphQLInputObjectType({
  name: 'CreateComment',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    cardId: { type: new GraphQLNonNull(GraphQLInt) }
  }
})

export const UpdateCommentInput = new GraphQLInputObjectType({
  name: 'UpdateComment',
  fields: {
    content: { type: GraphQLString },
    cardId: { type: GraphQLInt }
  }
})
