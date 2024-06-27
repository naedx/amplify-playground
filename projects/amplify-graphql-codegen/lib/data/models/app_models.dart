import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'app_models.freezed.dart';
part 'app_models.g.dart';

@freezed
class Author with _$Author {
  const Author._();

  const factory Author({
    required String firstName,
    required int id,
    required String lastName,
    List<Post?>? posts,
  }) = _Author;

  factory Author.fromJson(Map<String, dynamic> json) => _$AuthorFromJson(json);
}

@freezed
class Post with _$Post {
  const Post._();

  const factory Post({
    Author? author,
    required int id,
    required String title,
  }) = _Post;

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);
}

@freezed
class Todo with _$Todo {
  const Todo._();

  const factory Todo({
    String? content,
  }) = _Todo;

  factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
}