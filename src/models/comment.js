import { Model } from 'objection'
import { Card } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/card.js'
import { User } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/user.js'

export class Comment extends Model {
  static get tableName () {
    return 'comments'
  }

  static get relationMappings () {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'comments.ownerId'
        }
      },
      cards: {
        relation: Model.BelongsToOneRelation,
        modelClass: Card,
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
      required: ['content', 'ownerId', 'cardId'],
      properties: {
        id: { type: 'integer' },
        content: { type: 'string' },
        ownerId: { type: 'integer' },
        cardId: { type: 'integer' }
      }
    }
  }
}
