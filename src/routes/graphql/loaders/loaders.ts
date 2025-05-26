import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Post, User } from '../types/interfaces.js';

export const createLoaders = (prisma: PrismaClient) => {
  return {
    profile: profileLoader(prisma),
    post: postLoader(prisma),
    memberType: memberTypeLoader(prisma),
    userSubscribedTo: userSubscribedToLoader(prisma),
    subscribedToUser: subscribedToUserLoader(prisma),
  };
};

export const profileLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: [...ids] },
      },
    });
    const profilesMap = new Map(profiles.map((profile) => [profile.userId, profile]));

    return ids.map((id) => profilesMap.get(id) || null);
  });
};

export const postLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: [...ids] },
      },
    });

    const postsByAuthorsMap = new Map<string, Post[]>();

    posts.forEach((post) => {
      const authorPosts = postsByAuthorsMap.get(post.authorId) || [];

      authorPosts.push(post);
      postsByAuthorsMap.set(post.authorId, authorPosts);
    });

    return ids.map((key) => postsByAuthorsMap.get(key) || []);
  });
};

export const memberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: { in: [...ids] },
      },
    });

    const memberTypesMap = new Map(memberTypes.map((type) => [type.id, type]));

    return ids.map((key) => memberTypesMap.get(key) || null);
  });
};

export const userSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const subscribers = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: { in: [...ids] },
      },
      select: {
        subscriberId: true,
        author: true,
      },
    });

    const subscribersByAuthorsMap = new Map<string, User[]>();

    subscribers.forEach((subscriber) => {
      const authorSubscribers =
        subscribersByAuthorsMap.get(subscriber.subscriberId) || [];

      authorSubscribers.push(subscriber.author);
      subscribersByAuthorsMap.set(subscriber.subscriberId, authorSubscribers);
    });

    return ids.map((key) => subscribersByAuthorsMap.get(key) || []);
  });
};

export const subscribedToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const authors = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: { in: [...ids] },
      },
      select: {
        authorId: true,
        subscriber: true,
      },
    });

    const authorsBySubscribersMap = new Map<string, Partial<User>[]>();

    authors.forEach((author) => {
      const authorSubscribers = authorsBySubscribersMap.get(author.authorId) || [];

      authorSubscribers.push(author.subscriber);
      authorsBySubscribersMap.set(author.authorId, authorSubscribers);
    });

    return ids.map((key) => authorsBySubscribersMap.get(key) || []);
  });
};
