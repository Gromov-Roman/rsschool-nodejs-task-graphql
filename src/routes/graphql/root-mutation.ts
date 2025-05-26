import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ChangePostInput, CreatePostInput, PostType } from './types/post.js';
import { Context, PostInput, ProfileInput, UserInput } from './types/interfaces.js';
import { ChangeProfileInput, CreateProfileInput, ProfileType } from './types/profile.js';
import { ChangeUserInput, CreateUserInput, UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';

export const RootMutationType = new GraphQLObjectType<unknown, Context>({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: async (_, { dto }: { dto: PostInput }, { prisma }: Context) => {
        return prisma.post.create({ data: dto });
      },
    },

    createProfile: {
      type: ProfileType as GraphQLObjectType,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: async (_, { dto }: { dto: ProfileInput }, { prisma }: Context) => {
        return prisma.profile.create({ data: dto });
      },
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (_, { dto }: { dto: UserInput }, { prisma }: Context) => {
        return prisma.user.create({ data: dto });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        try {
          await prisma.post.delete({
            where: {
              id,
            },
          });

          return true;
        } catch (err) {
          return false;
        }
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        try {
          await prisma.user.delete({
            where: {
              id,
            },
          });

          return true;
        } catch (err) {
          return false;
        }
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        try {
          await prisma.profile.delete({
            where: {
              id,
            },
          });

          return true;
        } catch (err) {
          return false;
        }
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: Omit<PostInput, 'authorId'> },
        { prisma }: Context,
      ) => {
        return await prisma.post.update({ where: { id: id }, data: dto });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: UserInput },
        { prisma }: Context,
      ) => {
        return await prisma.user.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: ProfileType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: Omit<ProfileInput, 'userId'> },
        { prisma }: Context,
      ) => {
        return await prisma.profile.update({ where: { id }, data: dto });
      },
    },
    subscribeTo: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: Context,
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });

        const user = await prisma.user.findUnique({ where: { id: userId } });

        return !!user;
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: Context,
      ) => {
        try {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId: authorId,
              },
            },
          });
        } catch (err) {
          return false;
        }
      },
    },
  },
});
