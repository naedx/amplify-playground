// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'app_models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CreatePostInput _$CreatePostInputFromJson(Map<String, dynamic> json) {
  return _CreatePostInput.fromJson(json);
}

/// @nodoc
mixin _$CreatePostInput {
  String get formId => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get subject => throw _privateConstructorUsedError;

  /// Serializes this CreatePostInput to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreatePostInput
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreatePostInputCopyWith<CreatePostInput> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreatePostInputCopyWith<$Res> {
  factory $CreatePostInputCopyWith(
          CreatePostInput value, $Res Function(CreatePostInput) then) =
      _$CreatePostInputCopyWithImpl<$Res, CreatePostInput>;
  @useResult
  $Res call({String formId, String message, String name, String subject});
}

/// @nodoc
class _$CreatePostInputCopyWithImpl<$Res, $Val extends CreatePostInput>
    implements $CreatePostInputCopyWith<$Res> {
  _$CreatePostInputCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreatePostInput
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? formId = null,
    Object? message = null,
    Object? name = null,
    Object? subject = null,
  }) {
    return _then(_value.copyWith(
      formId: null == formId
          ? _value.formId
          : formId // ignore: cast_nullable_to_non_nullable
              as String,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      subject: null == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CreatePostInputImplCopyWith<$Res>
    implements $CreatePostInputCopyWith<$Res> {
  factory _$$CreatePostInputImplCopyWith(_$CreatePostInputImpl value,
          $Res Function(_$CreatePostInputImpl) then) =
      __$$CreatePostInputImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String formId, String message, String name, String subject});
}

/// @nodoc
class __$$CreatePostInputImplCopyWithImpl<$Res>
    extends _$CreatePostInputCopyWithImpl<$Res, _$CreatePostInputImpl>
    implements _$$CreatePostInputImplCopyWith<$Res> {
  __$$CreatePostInputImplCopyWithImpl(
      _$CreatePostInputImpl _value, $Res Function(_$CreatePostInputImpl) _then)
      : super(_value, _then);

  /// Create a copy of CreatePostInput
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? formId = null,
    Object? message = null,
    Object? name = null,
    Object? subject = null,
  }) {
    return _then(_$CreatePostInputImpl(
      formId: null == formId
          ? _value.formId
          : formId // ignore: cast_nullable_to_non_nullable
              as String,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      subject: null == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreatePostInputImpl extends _CreatePostInput
    with DiagnosticableTreeMixin {
  const _$CreatePostInputImpl(
      {required this.formId,
      required this.message,
      required this.name,
      required this.subject})
      : super._();

  factory _$CreatePostInputImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreatePostInputImplFromJson(json);

  @override
  final String formId;
  @override
  final String message;
  @override
  final String name;
  @override
  final String subject;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'CreatePostInput(formId: $formId, message: $message, name: $name, subject: $subject)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'CreatePostInput'))
      ..add(DiagnosticsProperty('formId', formId))
      ..add(DiagnosticsProperty('message', message))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('subject', subject));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreatePostInputImpl &&
            (identical(other.formId, formId) || other.formId == formId) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.subject, subject) || other.subject == subject));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, formId, message, name, subject);

  /// Create a copy of CreatePostInput
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreatePostInputImplCopyWith<_$CreatePostInputImpl> get copyWith =>
      __$$CreatePostInputImplCopyWithImpl<_$CreatePostInputImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreatePostInputImplToJson(
      this,
    );
  }
}

abstract class _CreatePostInput extends CreatePostInput {
  const factory _CreatePostInput(
      {required final String formId,
      required final String message,
      required final String name,
      required final String subject}) = _$CreatePostInputImpl;
  const _CreatePostInput._() : super._();

  factory _CreatePostInput.fromJson(Map<String, dynamic> json) =
      _$CreatePostInputImpl.fromJson;

  @override
  String get formId;
  @override
  String get message;
  @override
  String get name;
  @override
  String get subject;

  /// Create a copy of CreatePostInput
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreatePostInputImplCopyWith<_$CreatePostInputImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CreatePostResult _$CreatePostResultFromJson(Map<String, dynamic> json) {
  return _CreatePostResult.fromJson(json);
}

/// @nodoc
mixin _$CreatePostResult {
  String get id => throw _privateConstructorUsedError;

  /// Serializes this CreatePostResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreatePostResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreatePostResultCopyWith<CreatePostResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreatePostResultCopyWith<$Res> {
  factory $CreatePostResultCopyWith(
          CreatePostResult value, $Res Function(CreatePostResult) then) =
      _$CreatePostResultCopyWithImpl<$Res, CreatePostResult>;
  @useResult
  $Res call({String id});
}

/// @nodoc
class _$CreatePostResultCopyWithImpl<$Res, $Val extends CreatePostResult>
    implements $CreatePostResultCopyWith<$Res> {
  _$CreatePostResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreatePostResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CreatePostResultImplCopyWith<$Res>
    implements $CreatePostResultCopyWith<$Res> {
  factory _$$CreatePostResultImplCopyWith(_$CreatePostResultImpl value,
          $Res Function(_$CreatePostResultImpl) then) =
      __$$CreatePostResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id});
}

/// @nodoc
class __$$CreatePostResultImplCopyWithImpl<$Res>
    extends _$CreatePostResultCopyWithImpl<$Res, _$CreatePostResultImpl>
    implements _$$CreatePostResultImplCopyWith<$Res> {
  __$$CreatePostResultImplCopyWithImpl(_$CreatePostResultImpl _value,
      $Res Function(_$CreatePostResultImpl) _then)
      : super(_value, _then);

  /// Create a copy of CreatePostResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
  }) {
    return _then(_$CreatePostResultImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreatePostResultImpl extends _CreatePostResult
    with DiagnosticableTreeMixin {
  const _$CreatePostResultImpl({required this.id}) : super._();

  factory _$CreatePostResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreatePostResultImplFromJson(json);

  @override
  final String id;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'CreatePostResult(id: $id)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'CreatePostResult'))
      ..add(DiagnosticsProperty('id', id));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreatePostResultImpl &&
            (identical(other.id, id) || other.id == id));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id);

  /// Create a copy of CreatePostResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreatePostResultImplCopyWith<_$CreatePostResultImpl> get copyWith =>
      __$$CreatePostResultImplCopyWithImpl<_$CreatePostResultImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreatePostResultImplToJson(
      this,
    );
  }
}

abstract class _CreatePostResult extends CreatePostResult {
  const factory _CreatePostResult({required final String id}) =
      _$CreatePostResultImpl;
  const _CreatePostResult._() : super._();

  factory _CreatePostResult.fromJson(Map<String, dynamic> json) =
      _$CreatePostResultImpl.fromJson;

  @override
  String get id;

  /// Create a copy of CreatePostResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreatePostResultImplCopyWith<_$CreatePostResultImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Post _$PostFromJson(Map<String, dynamic> json) {
  return _Post.fromJson(json);
}

/// @nodoc
mixin _$Post {
  DateTime get createdAt => throw _privateConstructorUsedError;
  String? get createdBy => throw _privateConstructorUsedError;
  String get formId => throw _privateConstructorUsedError;
  String get id => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get subject => throw _privateConstructorUsedError;
  PostType get type => throw _privateConstructorUsedError;

  /// Serializes this Post to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Post
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PostCopyWith<Post> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PostCopyWith<$Res> {
  factory $PostCopyWith(Post value, $Res Function(Post) then) =
      _$PostCopyWithImpl<$Res, Post>;
  @useResult
  $Res call(
      {DateTime createdAt,
      String? createdBy,
      String formId,
      String id,
      String message,
      String name,
      String subject,
      PostType type});
}

/// @nodoc
class _$PostCopyWithImpl<$Res, $Val extends Post>
    implements $PostCopyWith<$Res> {
  _$PostCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Post
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? createdAt = null,
    Object? createdBy = freezed,
    Object? formId = null,
    Object? id = null,
    Object? message = null,
    Object? name = null,
    Object? subject = null,
    Object? type = null,
  }) {
    return _then(_value.copyWith(
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      createdBy: freezed == createdBy
          ? _value.createdBy
          : createdBy // ignore: cast_nullable_to_non_nullable
              as String?,
      formId: null == formId
          ? _value.formId
          : formId // ignore: cast_nullable_to_non_nullable
              as String,
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      subject: null == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as PostType,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PostImplCopyWith<$Res> implements $PostCopyWith<$Res> {
  factory _$$PostImplCopyWith(
          _$PostImpl value, $Res Function(_$PostImpl) then) =
      __$$PostImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {DateTime createdAt,
      String? createdBy,
      String formId,
      String id,
      String message,
      String name,
      String subject,
      PostType type});
}

/// @nodoc
class __$$PostImplCopyWithImpl<$Res>
    extends _$PostCopyWithImpl<$Res, _$PostImpl>
    implements _$$PostImplCopyWith<$Res> {
  __$$PostImplCopyWithImpl(_$PostImpl _value, $Res Function(_$PostImpl) _then)
      : super(_value, _then);

  /// Create a copy of Post
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? createdAt = null,
    Object? createdBy = freezed,
    Object? formId = null,
    Object? id = null,
    Object? message = null,
    Object? name = null,
    Object? subject = null,
    Object? type = null,
  }) {
    return _then(_$PostImpl(
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      createdBy: freezed == createdBy
          ? _value.createdBy
          : createdBy // ignore: cast_nullable_to_non_nullable
              as String?,
      formId: null == formId
          ? _value.formId
          : formId // ignore: cast_nullable_to_non_nullable
              as String,
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      subject: null == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as PostType,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PostImpl extends _Post with DiagnosticableTreeMixin {
  const _$PostImpl(
      {required this.createdAt,
      this.createdBy,
      required this.formId,
      required this.id,
      required this.message,
      required this.name,
      required this.subject,
      required this.type})
      : super._();

  factory _$PostImpl.fromJson(Map<String, dynamic> json) =>
      _$$PostImplFromJson(json);

  @override
  final DateTime createdAt;
  @override
  final String? createdBy;
  @override
  final String formId;
  @override
  final String id;
  @override
  final String message;
  @override
  final String name;
  @override
  final String subject;
  @override
  final PostType type;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'Post(createdAt: $createdAt, createdBy: $createdBy, formId: $formId, id: $id, message: $message, name: $name, subject: $subject, type: $type)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'Post'))
      ..add(DiagnosticsProperty('createdAt', createdAt))
      ..add(DiagnosticsProperty('createdBy', createdBy))
      ..add(DiagnosticsProperty('formId', formId))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('message', message))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('subject', subject))
      ..add(DiagnosticsProperty('type', type));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PostImpl &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.createdBy, createdBy) ||
                other.createdBy == createdBy) &&
            (identical(other.formId, formId) || other.formId == formId) &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.subject, subject) || other.subject == subject) &&
            (identical(other.type, type) || other.type == type));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, createdAt, createdBy, formId, id,
      message, name, subject, type);

  /// Create a copy of Post
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PostImplCopyWith<_$PostImpl> get copyWith =>
      __$$PostImplCopyWithImpl<_$PostImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PostImplToJson(
      this,
    );
  }
}

abstract class _Post extends Post {
  const factory _Post(
      {required final DateTime createdAt,
      final String? createdBy,
      required final String formId,
      required final String id,
      required final String message,
      required final String name,
      required final String subject,
      required final PostType type}) = _$PostImpl;
  const _Post._() : super._();

  factory _Post.fromJson(Map<String, dynamic> json) = _$PostImpl.fromJson;

  @override
  DateTime get createdAt;
  @override
  String? get createdBy;
  @override
  String get formId;
  @override
  String get id;
  @override
  String get message;
  @override
  String get name;
  @override
  String get subject;
  @override
  PostType get type;

  /// Create a copy of Post
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PostImplCopyWith<_$PostImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
