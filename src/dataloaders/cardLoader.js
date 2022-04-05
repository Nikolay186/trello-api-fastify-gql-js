import DataLoader from 'dataloader'
import { Card } from '../models/card.js'

export function getCardLoader (source) {
  let loader
  const type = source.constructor.name
  switch (type) {
    case 'Column':
      loader = new DataLoader((ids) => {
        const res = ids.map((columnId) => {
          return Card.query().where('cards.columnId', columnId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'User':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return Card.query().where('cards.ownerId', userId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Comment':
      loader = new DataLoader((ids) => {
        const res = ids.map((cardId) => {
          return Card.query().where('cards.id', cardId).first().execute()
        })
        return Promise.resolve(res)
      })
      return loader
    default:
      break
  }
}
