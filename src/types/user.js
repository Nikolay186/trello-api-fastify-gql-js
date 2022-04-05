import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { CardType } from './card.js'
import { ColumnType } from './column.js'
import { CommentType } from './comment.js'
import { getColumnLoader } from '../dataloaders/columnLoader.js'
import { getCardLoader } from '../dataloaders/cardLoader.js'
import { getCommentLoader } from '../dataloaders/commentLoader.js'

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    columns: {
      type: new GraphQLList(new GraphQLNonNull(ColumnType)),
      resolve: async (source) => {
        const loader = getColumnLoader(source)
        return loader.load(source.id)
      }
    },
    cards: {
      type: new GraphQLList(new GraphQLNonNull(CardType)),
      resolve: async (source) => {
        const loader = getCardLoader(source)
        return loader.load(source.id)
      }
    },
    comments: {
      type: new GraphQLList(new GraphQLNonNull(CommentType)),
      resolve: async (source) => {
        const loader = getCommentLoader(source)
        return loader.load(source.id)
      }
    }
  })
})

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUser',
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString }
  }
})

export const UpdateUserInput = new GraphQLInputObjectType({
  name: 'UpdateUser',
  fields: {
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  }
})
