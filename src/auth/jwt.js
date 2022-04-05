import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

let jwtKey = '123'

export function getToken (payload) {
  const token = jwt.sign(payload, jwtKey)
  return token
}

export async function findUser (token) {
  const user = await User.query().where('users.token', token).first().execute()
  return user
}
 
export function verify (token) {
  return jwt.verify(token, jwtKey)
}
