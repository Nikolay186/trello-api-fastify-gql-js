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
  await resetSequences(knex)
  await seedUsers(knex)
  await seedColumns(knex)
  await seedCards(knex)
  await seedComments(knex)
};

async function seedUsers (knex) {
  Model.knex(knex)
  for (let index = 0; index < 2000; index++) {
    const user = {
      username: faker.internet.userName() + index,
      password: faker.internet.password(8),
      email: faker.internet.email()
    }
    await User.query().insert({...user}).execute()
  }
}

async function seedColumns (knex) {
  Model.knex(knex)
  for (let index = 0; index < 2000; index++) {
    const column = {
      title: faker.lorem.word(),
      ownerId: faker.datatype.number({ min: 0, max: 2000 })
    }
    await Column.query().insert({...column}).execute()
  }
}

async function seedCards (knex) {
  Model.knex(knex)
  for (let index = 0; index < 2000; index++) {
    const card = {
      title: faker.lorem.word(),
      ownerId: faker.datatype.number({ min: 0, max: 2000 }),
      columnId: faker.datatype.number({ min: 0, max: 2000 })
    }
    await Card.query().insert({...card}).execute()
  }
}

async function seedComments (knex) {
  for (let index = 0; index < 2000; index++) {
    const comment = {
      content: faker.lorem.words(5),
      ownerId: faker.datatype.number({ min: 0, max: 2000 }),
      cardId: faker.datatype.number({ min: 0, max: 2000 })
    }
    await Comment.query().insert({...comment}).execute()
  }
}

async function resetSequences (knex) {
  const sequences = (await knex.raw(`SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name NOT LIKE '%migrations%';`)).rows
  sequences.map(async (seq) => {
    await knex.raw(`ALTER SEQUENCE ${seq.sequence_name} RESTART;`)
  })
}
