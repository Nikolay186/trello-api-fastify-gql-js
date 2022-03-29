import DataLoader from 'dataloader'
import { Card } from '../models/card.js'
import { Column } from '../models/column.js'
import { Comment } from '../models/comment.js'

export function getUserLoader (source) {
  let loader
  const type = source.constructor.name
  switch (type) {
    case 'Column':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return Column.query().where('columns.ownerId', userId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Card':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return Card.query().where('cards.ownerId', userId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Comment':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return Comment.query().where('comments.ownerId', userId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    default:
      break
  }
}
