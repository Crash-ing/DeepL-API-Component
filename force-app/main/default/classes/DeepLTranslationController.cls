public with sharing class DeepLTranslationController {

    @AuraEnabled
    public static String translateText(String textToTranslate, String targetLanguage, String sourceLanguage, String formality) {
        // Getting the address and key from Custom label
        String endpoint = 'https://api-free.deepl.com/v2/translate';
        String apiKey = System.Label.DeepL_API_Key;

        // Request body
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');

        // Request headers
        req.setHeader('Authorization', 'DeepL-Auth-Key ' + apiKey);
        req.setHeader('Content-Type', 'application/json');

        // Data in JSON format
        Map<String, Object> bodyMap = new Map<String, Object> {
            'text' => new List<String>{ textToTranslate },
            'target_lang' => targetLanguage,
            'tag_handling' => 'html'    // Ensures that HTML tags are preserved in the translation
        };

        // if a source language is provided, add it to the request body
        if (String.isNotBlank(sourceLanguage)) {
            bodyMap.put('source_lang', sourceLanguage);
        }

        // if a formality is provided and it's not 'default', add it to the request body
        if (String.isNotBlank(formality) && formality != 'default') {
            bodyMap.put('formality', formality);
        }

        req.setBody(JSON.serialize(bodyMap));

        // Sending the request and getting the response
        Http http = new Http();
        HttpResponse res = http.send(req);

        // Handling the response (200 = OK)
        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new AuraHandledException('Error from DeepL: ' + res.getStatusCode() + ' - ' + res.getBody());
        }
    }

    @AuraEnabled
    public static String uploadDocumentToDeepL(String base64FileData, String fileName, String targetLanguage, String sourceLanguage){
        String endpoint = 'https://api-free.deepl.com/v2/document';
        String apiKey = System.Label.DeepL_API_Key;

        String boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

        // Request body
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');

        // Request headers
        req.setHeader('Authorization', 'DeepL-Auth-Key ' + apiKey);
        req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);



        // for testing, so it can save the file
        return 'ok';
    }
}