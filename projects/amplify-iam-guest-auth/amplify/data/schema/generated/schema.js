import gql from 'graphql-tag';
export var PostType;
(function (PostType) {
  PostType["Post"] = "Post";
})(PostType || (PostType = {}));
export const CreatePost = gql`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
  }
}
    `;
