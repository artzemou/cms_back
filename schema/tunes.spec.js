// const { graphql } = require('graphql')
// const { makeExecutableSchema } = require('graphql-tools')

// const connection = require('../db/connection')
// const schemaDef = require('./index')
// const schema = makeExecutableSchema(schemaDef)
// const Tune = require('../db/Tune')
// const TUNES = require('../../fixtures/tunes')

// const REGEX_BSON = /^[0-9a-f]{24}$/

// describe('Tunes GraphQL schema', () => {
//   afterAll(() => {
//     connection.close()
//   })

//   describe('Queries', () => {
//     describe('allTunes', () => {
//       beforeAll(async () => {
//         await Tune.deleteMany({})
//         await Tune.insertMany(TUNES)
//       })

//       it('should order recent-first by default', async () => {
//         const { allTunes } = await run(
//           gql`
//             {
//               allTunes {
//                 title
//               }
//             }
//           `
//         )

//         expect(allTunes).toEqual([
//           { title: 'World Falls Apart' },
//           { title: 'Kenia' },
//           { title: 'Sky' },
//         ])
//       })

//       it('should honor sorting', async () => {
//         const { allTunes } = await run(
//           gql`
//             {
//               allTunes(sorting: SCORE_DESC) {
//                 title
//               }
//             }
//           `
//         )
//         expect(allTunes).toEqual([
//           { title: 'World Falls Apart' },
//           { title: 'Sky' },
//           { title: 'Kenia' },
//         ])
//       })
//     })
//   })

//   describe('Mutations', () => {
//     describe('createTune', () => {
//       it('should allow tune creation', async () => {
//         const attrs = require('../../fixtures/tune')
//         const input = Object.entries(attrs)
//           .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
//           .join(', ')

//         const { createTune } = await run(
//           gql`
//             mutation {
//               createTune(input: { ${input} }) {
//                 id
//                 album
//                 artist
//                 title
//                 score
//                 url
//               }
//             }
//           `
//         )

//         expect(createTune).toMatchObject({ ...attrs, score: 0 })
//         expect(createTune.id).toMatch(REGEX_BSON)
//       })
//     })

//     describe('voteOnTune', () => {
//       it('should allow votes on a tune', async () => {
//         const tune = await Tune.create({
//           artist: 'Joachim Pastor',
//           title: 'Kenia',
//         })

//         const { voteOnTune } = await run(
//           gql`
//             mutation {
//               voteOnTune(input: { tuneID: "${
//                 tune.id
//               }", direction: UPVOTE, comment: "This track is dope!" }) {
//                 tune {
//                   score
//                 }
//                 vote {
//                   comment
//                   direction
//                 }
//               }
//             }
//           `
//         )

//         expect(voteOnTune).toMatchObject({
//           vote: { comment: 'This track is dope!', direction: 'UPVOTE' },
//           tune: { score: 1 },
//         })
//       })
//     })
//   })
// })

// // Helper functions
// // ----------------

// // Apollo’s `gql` is not an innocuous tag, it produces GraphQL Document Nodes,
// // not the original string.  Let's use a simple interpolator instead, so we get
// // syntax coloring still.
// function gql(statics, ...dynamics) {
//   return (
//     dynamics.reduce((acc, dyn, index) => `${acc}${statics[index]}${dyn}`, '') +
//     statics[statics.length - 1]
//   )
// }

// function run(query) {
//   return graphql(schema, query).then(({ data }) => data)
// }
