import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { CardType } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/card.js'
import { UserType } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/user.js'
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
        return loader.load(source.id)
        // return userLoader.load(source)
        // return await User.query().where('users.id', source.ownerId).execute()
      }
    },
    card: {
      type: new GraphQLNonNull(CardType),
      resolve: async (source) => {
        const loader = getCardLoader(source)
        return loader.load(source.id)
        // return cardLoader.load(source)
        // return await Card.query().where('cards.id', source.cardId).execute()
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