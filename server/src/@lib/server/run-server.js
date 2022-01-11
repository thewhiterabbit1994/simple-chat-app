import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { createServer } from 'http'

import _applyMiddlewares from './middlewares'
import './run-db'

export default async ({ port, typeDefs, resolvers }) => {
  
  const app = express()

  _applyMiddlewares(app)

  const httpServer = createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => ({
      user: req.user,
    }),
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise(resolve => httpServer.listen({ port }, resolve));
  print(`app is running on port ${port}`)
  print(`GraphQL Server ready at http://localhost:${port}${server.graphqlPath}`);
}