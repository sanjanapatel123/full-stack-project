import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { PrismaClient } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";
import { setupSocket } from "./socket"; // 👈 Import it here
import { createContext } from "./context";
const prisma = new PrismaClient();
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
});
import loginRoute from "./routes/login";

app.use(cors());
app.use(express.json());
app.use("/api", loginRoute);

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: ({ req }) => ({
    //   prisma,
    //   user: null, // Replace with auth later if needed
    //   io,
    // }),
    context: ({ req }) => createContext({ req, io }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // 👇 Setup socket events here
  setupSocket(io);

  httpServer.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
};

startServer();
