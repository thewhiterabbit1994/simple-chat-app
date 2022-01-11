



import userResolver from "./user-resolver"



export default {
  Query: {
    ...userResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation
  },
}