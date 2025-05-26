import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';
import DataLoader from 'dataloader';

export interface CreateUserInput {
  name: string;
  balance: number;
}

export interface CreateProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
}

export interface ChangeUserInput {
  name?: string;
  balance?: number;
}

export interface ChangeProfileInput {
  isMale?: boolean;
  yearOfBirth?: number;
  memberTypeId?: MemberTypeId;
}

export interface ChangePostInput {
  title?: string;
  content?: string;
}

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
