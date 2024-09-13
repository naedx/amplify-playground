import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'app_models.freezed.dart';
part 'app_models.g.dart';

@freezed
class CreatePostInput with _$CreatePostInput {
  const CreatePostInput._();

  const factory CreatePostInput({
    required String formId,
    required String message,
    required String name,
    required String subject,
  }) = _CreatePostInput;

  factory CreatePostInput.fromJson(Map<String, dynamic> json) => _$CreatePostInputFromJson(json);
}

@freezed
class CreatePostResult with _$CreatePostResult {
  const CreatePostResult._();

  const factory CreatePostResult({
    required String id,
  }) = _CreatePostResult;

  factory CreatePostResult.fromJson(Map<String, dynamic> json) => _$CreatePostResultFromJson(json);
}

@freezed
class Post with _$Post {
  const Post._();

  const factory Post({
    required DateTime createdAt,
    String? createdBy,
    required String formId,
    required String id,
    required String message,
    required String name,
    required String subject,
    required PostType type,
  }) = _Post;

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);
}

enum PostType {
  @JsonKey(name: 'Post')
  post,
}