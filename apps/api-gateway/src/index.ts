import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { initializeDatabase } from '@flowsync/database';
import { sessionMiddleware } from './middleware/session';
import authRoutes from './routes/auth';

// Initialize database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

const app: Application = express();

// Middleware
app.use(express.json());
app.use(sessionMiddleware);

// Authentication routes
app.use('/auth', authRoutes);

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
    context: ({ req }) => {
      // Pass session data to GraphQL context
      return {
        user: (req.session as any)?.user,
        userId: (req.session as any)?.userId,
      };
    },
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