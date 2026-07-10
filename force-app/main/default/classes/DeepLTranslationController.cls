public with sharing class DeepLTranslationController {

    // Method to translate text using DeepL API
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

    // Method to upload a document to DeepL for translation
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

        // language parameters
        String bodyStart = '--' + boundary + '\r\n';
        bodyStart += 'Content-Disposition: form-data; name="target_lang"\r\n\r\n';
        bodyStart += targetLanguage + '\r\n';

        if (String.isNotBlank(sourceLanguage)) {
            bodyStart += '--' + boundary + '\r\n';
            bodyStart += 'Content-Disposition: form-data; name="source_lang"\r\n\r\n';
            bodyStart += sourceLanguage + '\r\n';
        }

        // Adding file beggining information
        bodyStart += '--' + boundary + '\r\n';
        bodyStart += 'Content-Disposition: form-data; name="file"; filename="' + fileName + '"\r\n';
        bodyStart += 'Content-Type: application/octet-stream\r\n\r\n';

        // End of the file marker
        String bodyEnd = '\r\n--' + boundary + '--\r\n';

        // Convert the body parts to hex for sending
        String hexStart = EncodingUtil.convertToHex(Blob.valueOf(bodyStart));
        String hexFile = EncodingUtil.convertToHex(EncodingUtil.base64Decode(base64FileData));
        String hexEnd = EncodingUtil.convertToHex(Blob.valueOf(bodyEnd));

        Blob finalMultipartBody = EncodingUtil.convertFromHex(hexStart + hexFile + hexEnd);
        req.setBodyAsBlob(finalMultipartBody);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new AuraHandledException('Error from DeepL document upload: ' + res.getStatusCode() + ' - ' + res.getBody());
        }
    }

    // Method to check the status of a document translation in DeepL
    @AuraEnabled
    public static String checkDocumentStatus(String documentId, String documentKey) {
        String endpoint = 'https://api-free.deepl.com/v2/document/' + documentId;
        String apiKey = System.Label.DeepL_API_Key;

        // Request body
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');

        // Request headers
        req.setHeader('Authorization', 'DeepL-Auth-Key ' + apiKey);
        req.setHeader('Content-Type', 'application/json');

        // Adding document key as a query parameter to provide authentication for the document status check
        Map<String, String> bodyMap = new Map<String, String> {
            'document_key' => documentKey
        };
        req.setBody(JSON.serialize(bodyMap));

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new AuraHandledException('Error from DeepL document status check: ' + res.getStatusCode() + ' - ' + res.getBody());
        }
    }

    // Method to download the translated document from DeepL
    @AuraEnabled
    public static String downloadDocument(String documentId, String documentKey) {
        String endpoint = 'https://api-free.deepl.com/v2/document/' + documentId + '/result';
        String apiKey = System.Label.DeepL_API_Key;

        // Request body
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');

        // Request headers
        req.setHeader('Authorization', 'DeepL-Auth-Key ' + apiKey);
        req.setHeader('Content-Type', 'application/json');

        // Adding document key as a query parameter to provide authentication for the document status check
        Map<String, String> bodyMap = new Map<String, String> {
            'document_key' => documentKey
        };
        req.setBody(JSON.serialize(bodyMap));

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            // Return the base64 encoded content of the translated document
            return EncodingUtil.base64Encode(res.getBodyAsBlob());
        } else {
            throw new AuraHandledException('Error downloading translated document: ' + res.getStatusCode() + ' - ' + res.getBody());
        }
    }

    // Method to fetch recent Salesforce files for translation
    @AuraEnabled(cacheable=true) 
    public static List<ContentVersion> getRecentSalesforceFiles() {
        return [
            SELECT Id, Title, FileExtension
            FROM ContentVersion
            WHERE IsLatest = true
            AND FileExtension IN ('docx', 'pptx', 'pdf', 'txt')
            ORDER BY CreatedDate DESC
            LIMIT 10
        ];
    }

    // Method to fetch the base64 content of a Salesforce file for translation
    @AuraEnabled
    public static String getSalesforceFileBase64(String contentVersionId) {
        ContentVersion cv = [
            SELECT VersionData
            FROM ContentVersion
            WHERE Id = :contentVersionId
            LIMIT 1
        ];
        return EncodingUtil.base64Encode(cv.VersionData);
    }
}