import { faker } from '@faker-js/faker'
import { Model } from 'objection'
import { Card } from '../src/models/card'
import { Column } from '../src/models/column'
import { Comment } from '../src/models/comment'
import { User } from '../src/models/user'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed (knex) {
  Model.knex(knex)
  await knex('users').del()
  await knex('columns').del()
  await knex('cards').del()
  await knex('comments').del()
  for (let index = 0; index < 2000; index++) {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(8),
      email: faker.internet.email()
    }
    await User.query().insert({...user}).execute()

    const column = {
      title: faker.lorem.word(),
      ownerId: faker.datatype.number({ min: 0, max: 2000 })
    }
    await Column.query().insert({...column}).execute()

    const card = {
      title: faker.lorem.word(),
      ownerId: faker.datatype.number({ min: 0, max: 2000 }),
      columnId: faker.datatype.number({ min: 0, max: 2000 })
    }
    await Card.query().insert({...card}).execute()

    const comment = {
      content: faker.lorem.words(5),
      ownerId: faker.datatype.number({ min: 0, max: 2000 }),
      cardId: faker.datatype.number({ min: 0, max: 2000 })
    }
    await Comment.query().insert({...comment}).execute()
  }
};
