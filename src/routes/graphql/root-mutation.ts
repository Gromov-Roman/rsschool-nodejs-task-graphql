import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const RootMutationType = new GraphQLObjectType<unknown, { message: string }>({
  name: 'Mutation',
  fields: {
    print: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        message: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_parent: unknown, args: { message: string }): string => {
        return args.message;
      },
    },
  },
});
