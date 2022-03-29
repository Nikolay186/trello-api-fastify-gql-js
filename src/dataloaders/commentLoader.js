import DataLoader from 'dataloader'
import { Comment } from '../models/comment.js'

export function getCommentLoader (source) {
  let loader
  const type = source.constructor.name
  switch (type) {
    case 'Card':
      loader = new DataLoader((ids) => {
        const res = ids.map((cardId) => {
          return Comment.query().where('comments.cardId', cardId).execute()
        })
        return Promise.resolve(res)
      })
      return loader
    case 'User':
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
