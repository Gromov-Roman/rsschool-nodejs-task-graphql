import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { ProfileType } from './types/profile.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  },
});
