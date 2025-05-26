import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, rootSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './loaders/loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body: { query, variables } }) {
      const parsedQuery = parse(query);
      const errorsValidation = validate(rootSchema, parsedQuery, [depthLimit(5)]);

      if (errorsValidation?.length) {
        return { errors: errorsValidation };
      }

      return graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
        contextValue: { prisma, loaders: createLoaders(prisma) },
      });
    },
  });
};

export default plugin;
