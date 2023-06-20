import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./graphql/schema.graphql",
  // documents: ["webapp/src/**/*.tsx"],
  generates: {
    /*
    "webapp/src/gql/": {
      preset: "client",
      plugins: [],
    },
    */
    "backend/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
