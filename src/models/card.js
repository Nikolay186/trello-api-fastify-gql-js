import { Model } from 'objection'
import { Column } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/column.js'
import { User } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/user.js'
import { Comment } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/comment.js'

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
