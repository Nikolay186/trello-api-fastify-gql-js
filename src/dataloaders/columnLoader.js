import DataLoader from 'dataloader'
import { Column } from '../models/column.js'
import { Card } from '../models/card.js'

export function getColumnLoader (source) {
  const type = source.constructor.name
  let loader
  switch (type) {
    case 'User':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return Column.query().where('columns.ownerId', userId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Card':
      loader = new DataLoader((ids) => {
        const res = ids.map((columnId) => {
          return Card.query().where('cards.columnId', columnId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    default:
      break
  }
}
