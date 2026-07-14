@isTest
public class DeepLHttpCalloutMock implements HttpCalloutMock {
    public HttpResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setStatusCode(200);

        String endpoint = req.getEndpoint();

        // Mock response for text translation
        if (endpoint.contains('/v2/translate')) {
            res.setBody('{"translations":[{"text":"Test translation from DeepL"}]}');
        }
        // Mock response for file download
        else if (endpoint.endsWith('/result')) {
            res.setbody('Base64_file_here');
        }
        // Mock response for status check
        else if (endpoint.contains('/v2/document/')) {
            res.setBody('{"document_id":"DOC_12345", "status":"done"}');
        }
        // Mock response for file upload
        else if (endpoint.contains('/v2/document')) {
            res.setBody('{"document_id":"DOC_12345", "document_key":"KEY_ABCDE"}');
        }

        return res;
    }
}