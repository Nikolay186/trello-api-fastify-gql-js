import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLList } from 'graphql'
import { UserType } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/user.js'
import { ColumnType } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/column.js'
import { CommentType } from './comment.js'
import { getUserLoader } from '../dataloaders/userLoader.js'
import { getColumnLoader } from '../dataloaders/columnLoader.js'
import { getCommentLoader } from '../dataloaders/commentLoader.js'

export const CardType = new GraphQLObjectType({
  name: 'Card',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLInt) },
    columnId: { type: new GraphQLNonNull(GraphQLInt) },
    owner: {
      type: new GraphQLNonNull(UserType),
      resolve: async (source) => {
        const loader = getUserLoader(source)
        return loader.load(source.id)
        // return userLoader.load(source)
        // return await User.query().where('users.id', source.ownerId).first().execute()
      }
    },
    column: {
      type: new GraphQLNonNull(ColumnType),
      resolve: async (source) => {
        const loader = getColumnLoader(source)
        return loader.load(source.id)
        // return columnLoader.load(source)
        // return await Column.query().where('columns.id', source.columnId).first().execute()
      }
    },
    comments: {
      type: new GraphQLList(new GraphQLNonNull(CommentType)),
      resolve: async (source) => {
        const loader = getCommentLoader(source)
        return loader.load(source.id)
        // return commentLoader.load(source)
        // return await Comment.query().where('comments.cardId', source.id).execute()
      }
    }
  })
})

export const CreateCardInput = new GraphQLInputObjectType({
  name: 'CreateCard',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    columnId: { type: new GraphQLNonNull(GraphQLInt) }
  }
})

export const UpdateCardInput = new GraphQLInputObjectType({
  name: 'UpdateCard',
  fields: {
    title: { type: GraphQLString },
    columnId: { type: GraphQLInt }
  }
})
