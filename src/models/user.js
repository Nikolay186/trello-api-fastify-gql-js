import { Model } from 'objection'
import { Card } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/card.js'
import { Column } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/column.js'
import { Comment } from '/Users/Nikolaj/projects/trello-api-objectionjs/src/models/comment.js'
import * as bcrypt from 'bcrypt'
import { getToken } from '../auth/jwt.js'

export class User extends Model {
  static get tableName () {
    return 'users'
  }

  async $beforeInsert () {
    this.password = await bcrypt.hash(this.password, 10)
    // this.token = getToken(this.username)
  }

  static get relationMappings () {
    return {
      columns: {
        relation: Model.HasManyRelation,
        modelClass: Column,
        join: {
          from: 'users.id',
          to: 'columns.ownerId'
        }
      },
      cards: {
        relation: Model.HasManyRelation,
        modelClass: Card,
        join: {
          from: 'users.id',
          to: 'cards.ownerId'
        }
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'users.id',
          to: 'comments.ownerId'
        }
      }
    }
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: ['string', 'null'] }
      }
    }
  }
}
