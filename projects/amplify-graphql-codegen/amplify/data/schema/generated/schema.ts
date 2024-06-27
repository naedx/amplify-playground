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

export type Author = {
  __typename?: 'Author';
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  posts?: Maybe<Array<Maybe<Post>>>;
};


export type AuthorPostsArgs = {
  findTitle?: InputMaybe<Scalars['String']['input']>;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<Author>;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  listPosts?: Maybe<Array<Maybe<Post>>>;
};

export type Todo = {
  __typename?: 'Todo';
  content?: Maybe<Scalars['String']['output']>;
};


export const ListPost = gql`
    query ListPost {
  listPosts {
    id
    title
    author {
      id
      firstName
      lastName
    }
  }
}
    `;