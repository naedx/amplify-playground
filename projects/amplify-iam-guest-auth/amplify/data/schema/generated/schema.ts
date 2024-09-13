import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDateTime: { input: any; output: any; }
  AWSJSON: { input: any; output: any; }
  AWSTimestamp: { input: any; output: any; }
};

export type CreatePostInput = {
  formId: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type CreatePostResult = {
  __typename?: 'CreatePostResult';
  id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<CreatePostResult>;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['AWSDateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  formId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  type: PostType;
};

export enum PostType {
  Post = 'Post'
}

export type Query = {
  __typename?: 'Query';
  echo?: Maybe<Scalars['String']['output']>;
};


export const CreatePost = gql`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
  }
}
    `;