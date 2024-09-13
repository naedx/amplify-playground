// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CreatePostInputImpl _$$CreatePostInputImplFromJson(
        Map<String, dynamic> json) =>
    _$CreatePostInputImpl(
      formId: json['formId'] as String,
      message: json['message'] as String,
      name: json['name'] as String,
      subject: json['subject'] as String,
    );

Map<String, dynamic> _$$CreatePostInputImplToJson(
        _$CreatePostInputImpl instance) =>
    <String, dynamic>{
      'formId': instance.formId,
      'message': instance.message,
      'name': instance.name,
      'subject': instance.subject,
    };

_$CreatePostResultImpl _$$CreatePostResultImplFromJson(
        Map<String, dynamic> json) =>
    _$CreatePostResultImpl(
      id: json['id'] as String,
    );

Map<String, dynamic> _$$CreatePostResultImplToJson(
        _$CreatePostResultImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
    };

_$PostImpl _$$PostImplFromJson(Map<String, dynamic> json) => _$PostImpl(
      createdAt: DateTime.parse(json['createdAt'] as String),
      createdBy: json['createdBy'] as String?,
      formId: json['formId'] as String,
      id: json['id'] as String,
      message: json['message'] as String,
      name: json['name'] as String,
      subject: json['subject'] as String,
      type: $enumDecode(_$PostTypeEnumMap, json['type']),
    );

Map<String, dynamic> _$$PostImplToJson(_$PostImpl instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'createdBy': instance.createdBy,
      'formId': instance.formId,
      'id': instance.id,
      'message': instance.message,
      'name': instance.name,
      'subject': instance.subject,
      'type': _$PostTypeEnumMap[instance.type]!,
    };

const _$PostTypeEnumMap = {
  PostType.post: 'post',
};
