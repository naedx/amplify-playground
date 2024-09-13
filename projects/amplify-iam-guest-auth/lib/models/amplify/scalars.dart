import 'dart:convert';

class CustomAWSJSON {
  final String _dataString;
  Map<String, dynamic>? mapData;
  bool _hasParsedData = false;

  CustomAWSJSON(this._dataString);

  @override
  toString() => _dataString;

  toJson() => _dataString;

  Map<String, dynamic>? toMap() {
    if (_hasParsedData == true) {
      return mapData;
    } else {
      _hasParsedData = true;
      mapData = jsonDecode(_dataString);
      return mapData;
    }
  }
}

CustomAWSJSON customAWSJSONFromJson(String dataString) =>
    CustomAWSJSON(dataString);

String customAWSJSONToJson(CustomAWSJSON obj) => obj.toString();
