import { Model } from 'objection'
import { Column } from './column.js'
import { User } from './user.js'
import { Comment } from './comment.js'

export class Card extends Model {
  static get tableName () {
    return 'cards'
  }

  static get relationMappings () {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'cards.ownerId'
        }
      },
      columns: {
        relation: Model.BelongsToOneRelation,
        modelClass: Column,
        join: {
          from: 'columns.id',
          to: 'cards.columnId'
        }
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'cards.id',
          to: 'comments.cardId'
        }
      }
    }
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['title', 'ownerId', 'columnId'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        ownerId: { type: 'integer' },
        columnId: { type: 'integer' }
      }
    }
  }
}
