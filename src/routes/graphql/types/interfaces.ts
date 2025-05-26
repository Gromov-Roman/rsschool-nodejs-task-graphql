import { MemberTypeId } from '../../member-types/schemas.js';

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
