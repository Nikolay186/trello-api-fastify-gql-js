import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { User } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/user.js'
import { Column } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/column.js'
import { Card } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/card.js'
import { Comment } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/comment.js'
import { CardType, CreateCardInput, UpdateCardInput } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/card.js'
import { ColumnType, CreateColumnInput, UpdateColumnInput } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/column.js'
import { CommentType, CreateCommentInput, UpdateCommentInput } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/comment.js'
import { CreateUserInput, UpdateUserInput, UserType } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/types/user.js'
import * as bcrypt from 'bcrypt'
import { MessageType } from './types/message.js'
import { GenericError } from './errors/generic_error.js'
import { UserFilter } from './filters/user.js'
import { ColumnFilter } from './filters/column.js'
import { CardFilter } from './filters/card.js'
import { CommentFilter } from './filters/comment.js'
import jwt from 'jsonwebtoken'

async function checkOwnership(entity, user) {
  if (entity.ownerId === user.id) { return true } else { return false }
}

async function checkAuth(request) {
  return jwt.verify(request.headers.authorization, '123')
}

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Users
      login: {
        type: UserType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (source, args, context) => {
          const user = await User.query().where('users.username', args.username).first().execute()
          if (user === undefined && user === null) {
            return new GenericError('User does not exist', 'NOT_FOUND')
          }
          if (bcrypt.compare(args.password, user.password)) {
            delete user.password
            user.token = jwt.sign({ username: user.username }, '123')
            return user
          } else {
            return new GenericError('Wrong password', 'UNAUTHORIZED')
          }
        },
      },
      searchUsers: {
        type: new GraphQLList(new GraphQLNonNull(UserType)),
        args: {
          filters: { type: UserFilter }
        },
        resolve: async (source, args, context) => {
          await checkAuth(context.request)
          const conditions = args.filters
          const applyFilters = conditions !== undefined
          if (!applyFilters) {
            return User.query().execute()
          }
          const searchById = conditions.id !== undefined
          const searchByIds = conditions.ids !== undefined
          const searchByUsername = conditions.username !== undefined
          const searchByPartialUsername = conditions.partUsername !== undefined
          const searchByEmail = conditions.email !== undefined
          const searchByPartialEmail = conditions.partEmail !== undefined
          let result = []
          let user
          
          if (searchById) {
            user = await User.query().findById(conditions.id).first().execute()
            result.push(user)
          } else if (searchByIds) {
            user = await User.query().findByIds(conditions.ids).execute()
            result.push(user)
          }
          if (searchByUsername) {
            user = await User.query().where('users.username', conditions.username).first().execute()
            result.push(user)
          }
          if (searchByPartialUsername) {
            user = await User.query().where('users.username', 'like', '%' + conditions.partUsername + '%').execute()
            result.push(user)
          }
          if (searchByEmail) {
            user = await User.query().where('users.email', conditions.email).first().execute()
            result.push(user)
          }
          if (searchByPartialEmail) {
            user = await User.query().where('users.email', 'like', '%' + conditions.partEmail + '%').execute()
            result.push(user)
          }
          result = result.flat()
          result.map((user) => { delete user.password; delete user.token })
          return result
        }
      },
      // Columns
      searchColumns: {
        type: new GraphQLList(new GraphQLNonNull(ColumnType)),
        args: {
          filters: { type: ColumnFilter }
        },
        resolve: async (source, args, context) => {
          await checkAuth(context.request)
          const conditions = args.filters
          const applyFilters = conditions !== undefined
          const searchById = conditions.id !== undefined
          const searchByIds = conditions.ids !== undefined
          const searchByTitle = conditions.title !== undefined
          const searchByPartialTitle = conditions.partTitle !== undefined
          const searchByOwner = conditions.ownerId !== undefined
          let result = []
          let column
          if (!applyFilters) {
            return Column.query().execute()
          }
          if (searchById) {
            column = await Column.query().findById(conditions.id).execute()
            result.push(column)
          } else if (searchByIds) {
            column = await Column.query().findByIds(conditions.ids).execute()
            result.push(column)
          }
          if (searchByTitle) {
            column = await Column.query().where('columns.title', conditions.title).execute()
            result.push(column)
          }
          if (searchByPartialTitle) {
            column = await Column.query().where('columns.title', 'like', '%' + conditions.partTitle + '%').execute()
            result.push(column)
          }
          if (searchByOwner) {
            column = await Column.query().where('columns.ownerId', conditions.ownerId).execute()
            result.push(column)
          }
          result = result.flat()
          return result
        }
      },
      // Cards
      searchCards: {
        type: new GraphQLList(new GraphQLNonNull(CardType)),
        args: {
          filters: { type: CardFilter }
        },
        resolve: async (source, args, context) => {
          await checkAuth(context.request)
          const conditions = args.filters
          const applyFilters = conditions !== undefined
          const searchById = conditions.id !== undefined
          const searchByIds = conditions.ids !== undefined
          const searchByTitle = conditions.title !== undefined
          const searchByPartialTitle = conditions.partTitle !== undefined
          const searchByOwner = conditions.ownerId !== undefined
          const searchByColumn = conditions.columnId !== undefined
          let result = []
          let card
          if (!applyFilters) {
            return Card.query().execute()
          }
          if (searchById) {
            card = await Card.query().findById(conditions.id).execute()
            result.push(card)
          } else if (searchByIds) {
            card = await Card.query().findByIds(conditions.ids).execute()
            result.push(card)
          }
          if (searchByTitle) {
            card = await Card.query().where('cards.title', conditions.title).execute()
            result.push(card)
          }
          if (searchByPartialTitle) {
            card = await Card.query().where('cards.title', 'like', '%' + conditions.partTitle + '%').execute()
            result.push(card)
          }
          if (searchByOwner) {
            card = await Card.query().where('cards.ownerId', conditions.ownerId).execute()
            result.push(card)
          }
          if (searchByColumn) {
            card = await Card.query().where('cards.columnId', conditions.columnId).execute()
            result.push(card)
          }
          result = result.flat()
          return result
        }
      },
      // Comments
      searchComments: {
        type: new GraphQLList(new GraphQLNonNull(CommentType)),
        args: {
          filters: { type: CommentFilter }
        },
        resolve: async (source, args, context) => {
          await checkAuth(context.request)
          const conditions = args.filters
          const applyFilters = conditions !== undefined
          const searchById = conditions.id !== undefined
          const searchByIds = conditions.ids !== undefined
          const searchByContent = conditions.content !== undefined
          const searchByPartialContent = conditions.partContent !== undefined
          const searchByOwner = conditions.ownerId !== undefined
          const searchByCard = conditions.cardId !== undefined
          let result = []
          let comment
          if (!applyFilters) {
            return Comment.query().execute()
          }
          if (searchById) {
            comment = await Comment.query().findById(conditions.id).execute()
            result.push(comment)
          } else if (searchByIds) {
            comment = await Comment.query().findByIds(conditions.ids).execute()
            result.push(comment)
          }
          if (searchByContent) {
            comment = await Comment.query().where('comments.content', conditions.content).execute()
            result.push(comment)
          }
          if (searchByPartialContent) {
            comment = await Comment.query().where('comments.content', 'like', '%' + conditions.partContent + '%').execute()
            result.push(comment)
          }
          if (searchByOwner) {
            comment = await Card.query().where('comments.ownerId', conditions.ownerId).execute()
            result.push(comment)
          }
          if (searchByCard) {
            comment = await Card.query().where('comments.cardId', conditions.cardId).execute()
            result.push(comment)
          }
          result = result.flat()
          return result
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: {
      // Users
      createUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          input: { type: new GraphQLNonNull(CreateUserInput) }
        },
        resolve: async (root, args) => {
          const username = args.input.username

          let nameCheck = await User.query().where('users.username', username).execute()
          if (nameCheck.length !== 0) {
            throw new GenericError('Username is already in use', 'USERNAME_IN_USE')
          }

          let user = {
            username,
            password: args.input.password
          }
          user = await User.query().insert({...user}).returning('*').execute()
          delete user.password
          return user
        }

      },
      updateUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          pwd: { type: new GraphQLNonNull(GraphQLString) },
          input: { type: new GraphQLNonNull(UpdateUserInput) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()
          if (!await bcrypt.compare(args.pwd, user.password)) {
            throw new GenericError('Wrong password', 'FORBIDDEN')
          }
          return User.query().patch(args.input).where('users.username', user.username).returning('*').first().execute()
        }
      },
      deleteUser: {
        type: new GraphQLNonNull(MessageType),
        args: {
          pwd: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()
          if (!await bcrypt.compare(args.pwd, user.password)) {
            throw new GenericError('Wrong password', 'FORBIDDEN')
          }
          await User.query().delete().where('users.username', user.username).returning('*').execute()
          return { message: `User ${user.username} deleted` }
        }
      },
      // Columns
      createColumn: {
        type: new GraphQLNonNull(ColumnType),
        args: {
          token: { type: new GraphQLNonNull(GraphQLString) },
          input: { type: new GraphQLNonNull(CreateColumnInput) },
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()
          args.input.ownerId = user.id
          return Column.query().insert(args.input).returning('*').execute()
        }
      },
      updateColumn: {
        type: new GraphQLNonNull(ColumnType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
          input: { type: new GraphQLNonNull(UpdateColumnInput) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          const column = await Column.query().where('columns.ownerId', user.id).where('columns.id', args.id).first().execute()
          if (await checkOwnership(column, user)) {
            return Column.query().patch(args.input).where('columns.id', args.id).returning('*').first().execute()
          } else {
            throw new GenericError('Cannot update column. You are not the owner', 'UNAUTHORIZED')
          }
        }
      },
      deleteColumn: {
        type: new GraphQLNonNull(ColumnType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (root, args, context) => {
          const user = context.user
          const column = await Column.query().where('columns.ownerId', user.id).where('columns.id', args.id).first().execute()
          if (column) {
            return Column.query().delete().where('columns.id', args.id).returning('*').execute()
          } else {
            throw new GenericError('Cannot delete column. You are not the owner', 'UNAUTHORIZED')
          }
        }
      },
      // Cards
      createCard: {
        type: new GraphQLNonNull(CardType),
        args: {
          input: { type: new GraphQLNonNull(CreateCardInput) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          args.input.ownerId = user.id
          return Card.query().insert(args.input).returning('*').execute()
        }
      },
      updateCard: {
        type: new GraphQLNonNull(CardType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
          input: { type: new GraphQLNonNull(UpdateCardInput) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          const card = await Card.query().where('cards.id', args.id).where('cards.ownerId', user.id).first().execute()
          if (checkOwnership(card, user)) {
            return Card.query().patch(args.input).where('cards.id', args.id).returning('*').first().execute()
          } else {
            throw new GenericError('Cannot update card. You are not the owner', 'UNAUTHORIZED')
          }
        }
      },
      deleteCard: {
        type: new GraphQLNonNull(CardType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          const card = await Card.query().where('cards.id', args.id).where('cards.ownerId', user.id).first().execute()
          if (checkOwnership(card, user)) {
            return Card.query().delete().where('cards.id', args.id).returning('*').execute()
          } else {
            throw new GenericError('Cannot delete card. You are not the owner', 'UNAUTHORIZED')
          }
        }
      },
      // Comments
      createComment: {
        type: new GraphQLNonNull(CommentType),
        args: {
          input: { type: new GraphQLNonNull(CreateCommentInput) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          args.input.ownerId = user.id
          return Comment.query().insert(args.input).returning('*').execute()
        }
      },
      updateComment: {
        type: new GraphQLNonNull(CommentType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
          input: { type: new GraphQLNonNull(UpdateCommentInput) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          const comment = await Comment.query().where('comments.id', args.id).where('comments.ownerId', user.id).first().execute()
          if (checkOwnership(comment, user)) {
            return Comment.query().patch(args.input).where('comments.id', args.id).returning('*').first().execute()
          } else {
            throw new GenericError('Cannot update comment. You are not the owner', 'UNAUTHORIZED')
          }
        }
      },
      deleteComment: {
        type: new GraphQLNonNull(CommentType),
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (root, args, context) => {
          const username = (await checkAuth(context.request)).username
          const user = await User.query().where('users.username', username).first().execute()

          const comment = await Comment.query().where('comments.id', args.id).where('comments.ownerId', user.id).first().execute()
          if (checkOwnership(comment, user)) {
            return Comment.query().delete().where('comments.id', args.id).returning('*').execute()
          } else {
            throw new GenericError('Cannot delete comment. You are not the owner', 'UNAUTHORIZED')
          }
        }
      }
    }
  })
})
