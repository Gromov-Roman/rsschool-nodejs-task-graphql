import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';
import DataLoader from 'dataloader';

export type PostInput = {
  title: string;
  content: string;
  authorId: string;
};

export type UserInput = {
  name: string;
  balance: number;
};

export type ProfileInput = {
  userId: string;
  memberTypeId: MemberTypeId;
  isMale: boolean;
  yearOfBirth: number;
};

export interface User {
  id: string;
  name: string;
  balance: number;
  profile?: Profile;
  posts?: Post[];
  userSubscribedTo?: User[];
  subscribedToUser?: User[];
}

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
  memberType?: MemberType;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
}

export interface MemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
}

export interface Context {
  prisma: PrismaClient;
  loaders: Loaders;
}

export interface Loaders {
  profile: DataLoader<string, Profile | null>;
  post: DataLoader<string, Post[]>;
  memberType: DataLoader<string, MemberType | null>;
  userSubscribedTo: DataLoader<string, User[]>;
  subscribedToUser: DataLoader<string, User[]>;
}
