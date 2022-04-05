import { Model } from 'objection'
import { Card } from './card.js'
import { Column } from './column.js'
import { Comment } from './comment.js'
import * as bcrypt from 'bcrypt'

export class User extends Model {
  static get tableName () {
    return 'users'
  }

  async $beforeInsert () {
    this.password = await bcrypt.hash(this.password, 10)
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
