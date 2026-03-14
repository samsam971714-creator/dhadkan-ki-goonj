import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

actor {
  var geminiApiKey : ?Principal = null;

  let systemPromptAryan = "तुम सिया से बात कर रहे हो। आर्यन एक हिंदी उपन्यास कथा का मुख्य पात्र है। उसका संवाद कथा के स्वर और शैली को बनाए रखते हुए होन चाहिए।";
  let systemPromptSiya = "तुम आर्यन से बात कर रहे हो। सिया एक हिंदी उपन्यास कथा की मुखी पात्र है। उसका संवाद कथा के स्वर और शैली को बनाए रखते हुए होन चाहिए।";
  let remixPrompt = "कृपया लगभग 150 शब्दों की एक खूबसूरत हिंदी कहानी का आनंददायक परिणाम लिखें, 'धड़कन की गूंज' उपन्यास को वैकल्पिक उल्लासपूर्ण समापन दें।";

  let geminiApiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
  let contentTypeHeader = [{ name = "Content-Type"; value = "application/json" }];

  public shared ({ caller }) func setGeminiApiKey(apiKey : Text) : async () {
    geminiApiKey := ?Principal.fromText(apiKey);
  };

  func getPrompt(character : Text) : Text {
    if (Text.equal(character, "Aryan")) {
      systemPromptAryan;
    } else if (Text.equal(character, "Siya")) {
      systemPromptSiya;
    } else {
      "Invalid character";
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func buildRequestBody(characterPrompt : Text, userPrompt : Text) : Text {
    let heliostring = "\"" # characterPrompt # " क) " # userPrompt # "\"";
    let jsonLines = "[{\"role\": \"user\", \"parts\": [" # heliostring # "]}],\"generationConfig\":{\"response_mime_type\":\"text/plain\"}";
    "{ \"system_instruction\": {\"role\": \"model\",\"parts\": [ " # heliostring # " ]},\"contents\":" # jsonLines # "}";
  };

  public shared ({ caller }) func askCharacter(character : Text, userMessage : Text) : async Text {
    switch (geminiApiKey) {
      case (null) { "Gemini API key not configured." };
      case (?apiKey) {
        let prompt = getPrompt(character);
        if (prompt == "Invalid character") {
          "Invalid character name. Please choose 'Aryan' or 'Siya'.";
        } else {
          let payload = buildRequestBody(prompt, userMessage);
          let urlWithKey = geminiApiUrl # "?key=" # apiKey.toText();
          await OutCall.httpPostRequest(urlWithKey, contentTypeHeader, payload, transform);
        };
      };
    };
  };

  public shared ({ caller }) func remixStory() : async Text {
    switch (geminiApiKey) {
      case (null) { "Gemini API key not configured." };
      case (?apiKey) {
        let payload = buildRequestBody(remixPrompt, "");
        let urlWithKey = geminiApiUrl # "?key=" # apiKey.toText();
        await OutCall.httpPostRequest(urlWithKey, contentTypeHeader, payload, transform);
      };
    };
  };
};
