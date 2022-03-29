import { Model } from 'objection'
import { Card } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/card.js'
import { User } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/user.js'

export class Column extends Model {
  static get tableName () {
    return 'columns'
  }

  static get relationMappings () {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'columns.ownerId'
        }
      },
      cards: {
        relation: Model.HasManyRelation,
        modelClass: Card,
        join: {
          from: 'columns.id',
          to: 'cards.columnId'
        }
      }
    }
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['title', 'ownerId'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        ownerId: { type: 'integer' }
      }
    }
  }
}
