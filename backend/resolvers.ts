import { Resolvers } from "./generated/graphql";

export const resolvers: Resolvers = {
  Query: {
    auth: async (_parent, _args, _context, _info) => {
      console.log("auth", _args);
      return "OK";
    },
  },
};
