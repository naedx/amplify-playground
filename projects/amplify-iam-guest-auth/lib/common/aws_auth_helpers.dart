import 'dart:convert';

import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:aws_signature_v4/aws_signature_v4.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class SwitchAuthZModeLink extends Link {
  final String apiKey;

  SwitchAuthZModeLink({required this.apiKey});

  @override
  Stream<Response> request(
    Request request, [
    NextLink? forward,
  ]) async* {
    // Update the Auth header with the API key if there is not Auth Token present.
    if (request.context.entry<HttpLinkHeaders>()?.headers['Authorization'] !=
        null) {
      yield* forward!(request);
      return;
    } else {
      request = request.updateContextEntry<HttpLinkHeaders>(
        (headers) => HttpLinkHeaders(
          headers: <String, String>{
            ...headers?.headers ?? <String, String>{},
            'x-api-key': apiKey,
          },
        ),
      );

      yield* forward!(request);
      return;
    }
  }
}

class SignIAMRequestLink extends Link {
  final String gqlApiRegion;

  final String gqlApiEndpoint;

  SignIAMRequestLink({
    required this.gqlApiRegion,
    required this.gqlApiEndpoint,
  });

  @override
  Stream<Response> request(
    Request request, [
    NextLink? forward,
  ]) async* {
    // Update the Auth header with a signed request if there is no Authorization header present.
    if (request.context.entry<HttpLinkHeaders>()?.headers['Authorization'] !=
        null) {
      yield* forward!(request);
      return;
    } else {
      final AWSCredentials awsCredentials =
          (await Amplify.Auth.fetchAuthSession() as CognitoAuthSession)
              .credentialsResult
              .value;

      RequestSerializer serializer = const RequestSerializer();

      final body = json.encode(serializer.serializeRequest(request));

      AWSBaseHttpRequest awsBaseReq = AWSHttpRequest(
        method: AWSHttpMethod.post,
        uri: Uri.parse(gqlApiEndpoint),
        body: utf8.encode(body),
      );

      safePrint('awsBaseReq.body:: ${awsBaseReq.body.toString()}');

      final signer = AWSSigV4Signer(
        credentialsProvider: AWSCredentialsProvider(awsCredentials),
      );

      final scope = AWSCredentialScope(
        region: gqlApiRegion,
        service: AWSService.appSync,
      );

      final AWSSignedRequest signedRequest = await signer.sign(
        awsBaseReq,
        credentialScope: scope,
        serviceConfiguration: const BaseServiceConfiguration(
            // signBody: false,
            // normalizePath: true,
            // omitSessionToken: true,
            // doubleEncodePathSegments: true,
            ),
      );

      request = request.updateContextEntry<HttpLinkHeaders>(
        (headers) => HttpLinkHeaders(
          headers: <String, String>{
            ...headers?.headers
                    .map((key, value) => MapEntry(key.toLowerCase(), value)) ??
                <String, String>{},
            ...signedRequest.headers
                .map((key, value) => MapEntry(key.toLowerCase(), value)),
          },
        ),
      );

      safePrint(
          'SignedRequest:: (Canonical Request Produced) ${signedRequest.canonicalRequest}');

      yield* forward!(request);
      return;
    }
  }
}
