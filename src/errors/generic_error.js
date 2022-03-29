import { ApolloError } from 'apollo-server-errors'

export class GenericError extends ApolloError {
  constructor (msg, code) {
    super(msg, code)
    Object.defineProperty(this, 'name', { value: 'GenericError' })
  }
}
