import { Resolvers } from "./generated/graphql";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

import { GraphQLScalarType, Kind } from "graphql";

// https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

export const resolvers: Resolvers = {
  Query: {
    auth: async (_parent, _args, _context, _info) => {
      console.log("auth", _args);
      return "OK";
    },
    user: async (_parent, _args, _context, _info) => {
      return await prisma.user.findMany();
    },
    userSection: async (_parent, _args, _context, _info) => {
      return await prisma.userSection.findMany();
    },
  },
  User: {
    userSection: async (parent) => {
      if (!parent.userSectionCode) return null;
      return await prisma.userSection.findUnique({
        where: { code: parent.userSectionCode },
      });
    },
  },
  UserSection: {
    users: async (parent) => {
      return await prisma.user.findMany({
        where: { userSectionCode: parent.code },
      });
    },
  },
  Date: dateScalar,
};
