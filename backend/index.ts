import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import { resolvers } from "./resolvers";

const typeDefs = fs.readFileSync("./graphql/schema.graphql", {
  encoding: "utf-8",
});

import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";

type AppContext = {
  token?: string;
};

const app = express();
const httpServer = http.createServer(app);

import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

app.use("/", express.static("./webapp/dist"));

app.get("/*", (_req, res) => {
  res.sendFile(path.resolve("./webapp/dist", "index.html"));
});

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
