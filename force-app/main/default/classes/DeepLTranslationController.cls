public with sharing class DeepLTranslationController {

    @AuraEnabled
    public static String translateText(String textToTranslate, String targetLanguage) {
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
            'target_lang' => targetLanguage
        };
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
}