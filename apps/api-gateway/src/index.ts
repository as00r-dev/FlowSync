import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

const app = express();

// Placeholder for GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// Placeholder for resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from FlowSync API Gateway!',
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch(error => {
  console.error('Error starting Apollo Server:', error);
});