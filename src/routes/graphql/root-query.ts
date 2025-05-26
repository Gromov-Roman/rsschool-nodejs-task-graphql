import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { ProfileType } from './types/profile.js';
import { Context, User } from './types/interfaces.js';
import { MemberTypeIdType, MemberTypeType } from './types/member-type.js';
import { PostType } from './types/post.js';
import { UserType } from './types/user.js';
import { FieldsByTypeName, parseResolveInfo } from 'graphql-parse-resolve-info';
import { Prisma } from '@prisma/client';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma: { profile } }: Context) =>
        profile.findUnique({ where: { id } }),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_, __, { prisma: { profile } }: Context) => profile.findMany(),
    },

    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdType) },
      },
      resolve: (_, { id }: { id: string }, { prisma: { memberType } }: Context) =>
        memberType.findUnique({ where: { id } }),
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: (_, __, { prisma: { memberType } }: Context) => memberType.findMany(),
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma: { post } }: Context) =>
        post.findUnique({ where: { id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (_, __, { prisma: { post } }: Context) => post.findMany(),
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { id }: { id: string },
        { prisma }: Context,
      ): Promise<User | null> => prisma.user.findUnique({ where: { id } }),
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_, __, { prisma, loaders }: Context, info) => {
        const parsedInfo = parseResolveInfo(info);
        const userFields = parsedInfo?.fieldsByTypeName?.User as FieldsByTypeName['User'];

        const needsUserSubscribedTo = 'userSubscribedTo' in userFields;
        const needsSubscribedToUser = 'subscribedToUser' in userFields;

        const include: Prisma.UserFindManyArgs['include'] = {
          userSubscribedTo: needsUserSubscribedTo,
          subscribedToUser: needsSubscribedToUser,
        };

        const users: User[] = await prisma.user.findMany({
          ...(Object.keys(include).length ? { include } : {}),
        });

        for (const user of users) {
          if (needsUserSubscribedTo && user.userSubscribedTo) {
            loaders.userSubscribedTo.prime(user.id, user.userSubscribedTo);
          }

          if (needsSubscribedToUser && user.subscribedToUser) {
            loaders.subscribedToUser.prime(user.id, user.subscribedToUser);
          }
        }

        return users;
      },
    },
  },
});
