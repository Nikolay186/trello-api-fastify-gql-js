import DataLoader from 'dataloader'
import { Column } from '../models/column.js'

export function getColumnLoader (source) {
  const type = source.constructor.name
  let loader
  switch (type) {
    case 'User':
      loader = new DataLoader((ids) => {
        console.log(ids)
        const res = ids.map((userId) => {
          console.log(userId)
          return Column.query().where('columns.ownerId', userId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Card':
      loader = new DataLoader((ids) => {
        const res = ids.map((columnId) => {
          return Column.query().where('columns.id', columnId).first().execute()
        })
        return Promise.resolve(res)
      })
      return loader
    default:
      break
  }
}
