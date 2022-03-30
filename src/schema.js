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

async function checkAuth (currentUser) {
  if (!currentUser) {
    return new GenericError('Not authorized', 'UNAUTHORIZED')
  }
  const userCheck = User.query().where('users.username', currentUser.username)
  if (!userCheck) {
    return new GenericError('Not authorized', 'UNAUTHORIZED')
  }
}

async function checkOwnership (entity, user) {
  if (entity.ownerId === user.id) { return true } else { return false }
}

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Users
      getUsers: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          let users = await User.query().execute()
          users.forEach(user => { delete user.password; delete user.token })
          return users
        }
      },
      getUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          let user = await User.query().where('users.id', args.id).first().execute()
          delete user.password
          delete user.token
          return user
        }
      },
      // Columns
      getColumns: {
        type: new GraphQLNonNull(new GraphQLList(ColumnType)),
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          return Column.query().execute()
        }
      },
      getColumn: {
        type: ColumnType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          return Column.query().where('columns.id', args.id).first().execute()
        }
      },
      // Cards
      getCards: {
        type: new GraphQLNonNull(new GraphQLList(CardType)),
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          return Card.query().execute()
        }
      },
      getCard: {
        type: CardType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          return Card.query().where('cards.id', args.id).first().execute()
        }
      },
      // Comments
      getComments: {
        type: new GraphQLNonNull(new GraphQLList(CommentType)),
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          return Comment.query().execute()
        }
      },
      getComment: {
        type: CommentType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: async (source, args, context) => {
          checkAuth(context.user)
          return Comment.query().where('comments.id', args.id).first().execute()
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
          return User.query().insert({...user}).returning('*').execute()
        }

      },
      updateUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          pwd: { type: new GraphQLNonNull(GraphQLString) },
          input: { type: new GraphQLNonNull(UpdateUserInput) }
        },
        resolve: async (root, args, context) => {
          await checkAuth(context.user)
          if (!await bcrypt.compare(args.pwd, context.user.password)) {
            throw new GenericError('Wrong password', 'FORBIDDEN')
          }
          return User.query().patch(args.input).where('users.username', context.user.username).returning('*').first().execute()
        }
      },
      deleteUser: {
        type: new GraphQLNonNull(MessageType),
        args: {
          pwd: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (root, args, context) => {
          const user = context.user
          await checkAuth(user)
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
          input: { type: new GraphQLNonNull(CreateColumnInput) }
        },
        resolve: async (root, args, context) => {
          const user = context.user
          await checkAuth(user)
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
          const user = context.user
          await checkAuth(user)
          if (await checkOwnership(await Column.query().where('columns.ownerId', user.id).where('columns.id', args.id).execute(), user)) {
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
          await checkAuth(user)
          if (await Column.query().where('columns.ownerId', user.id).where('columns.id', args.id).execute()) {
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
          const user = context.user
          await checkAuth(user)
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
          const user = context.user
          await checkAuth(context.user)
          if (checkOwnership(await Card.query().where('cards.id', args.id).where('cards.ownerId', user.id).execute())) {
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
          const user = context.user
          await checkAuth(context.user)
          if (checkOwnership(await Card.query().where('cards.id', args.id).where('cards.ownerId', user.id).execute())) {
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
          const user = context.user
          await checkAuth(user)
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
          const user = context.user
          await checkAuth(context.user)
          if (checkOwnership(Comment.query().where('comments.id', args.id).where('comments.ownerId', user.id).execute())) {
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
          const user = context.user
          await checkAuth(user)
          if (checkOwnership(Comment.query().where('comments.id', args.id).where('comments.ownerId', user.id).execute())) {
            return Comment.query().delete().where('comments.id', args.id).returning('*').execute()
          } else {
            throw new GenericError('Cannot delete comment. You are not the owner', 'UNAUTHORIZED')
          }
        }
      }
    }
  })
})
