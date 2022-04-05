import DataLoader from 'dataloader'
import { User } from '../models/user.js'

export function getUserLoader (source) {
  let loader
  const type = source.constructor.name
  switch (type) {
    case 'Column':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return User.query().where('users.id', userId).first().execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Card':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return User.query().where('users.id', userId).first().execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'Comment':
      loader = new DataLoader((ids) => {
        const res = ids.map((userId) => {
          return User.query().where('users.id', userId).first().execute()
        })
        return Promise.resolve(res)
      })
      return loader
    default:
      break
  }
}
