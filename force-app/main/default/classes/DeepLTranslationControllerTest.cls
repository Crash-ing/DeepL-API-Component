@isTest
public class DeepLTranslationControllerTest {
    
    @TestSetup
    static void makeData(){
        ContentVersion testFile = new ContentVersion();
        testFile.Title = 'Test File';
        testFile.PathOnClient = 'Test_File.txt';
        testFile.VersionData = Blob.valueOf('This is the content of the test file.');
        testFile.IsMajorVersion = true;
        insert testFile;   
    }

    @isTest
    static void testTranslateText() {
        // Tells Salesforce to use the mock class instead of the API
        Test.setMock(HttpCalloutMock.class, new DeepLHttpCalloutMock());

        Test.startTest();
        String result = DeepLTranslationController.translateText('Sveiki', 'EN-US', 'LV', 'default');
        Test.stopTest();

        System.assert(result.contains('Test translation from DeepL'), 'Translation has to be the same as the mock answer');
    }

    @isTest
    static void testUploadDocumentToDeepL() {
        Test.setMock(HttpCalloutMock.class, new DeepLHttpCalloutMock());
        String fakeBase64 = EncodingUtil.base64Encode(Blob.valueOf('Content of the test file'));

        Test.startTest();
        String result = DeepLTranslationController.uploadDocumentToDeepL(fakeBase64, 'test.txt', 'EN-US', 'LV');
        Test.stopTest();

        System.assert(result.contains('DOC_12345'), 'Should have returned docs ID from the mock class');
    }

    @isTest
    static void testCheckDocumentStatus() {
        Test.setMock(HttpCalloutMock.class, new DeepLHttpCalloutMock());

        Test.startTest();
        String result = DeepLTranslationController.checkDocumentStatus('DOC_12345', 'KEY_ABCDE');
        Test.stopTest();

        System.assert(result.contains('done'), 'Status should be done');
    }
    
    @isTest
    static void testGetRecentSalesforceFiles() {
        Test.startTest();
        List<ContentVersion> files = DeepLTranslationController.getRecentSalesforcefiles();
        Test.stopTest();

        System.assertEquals(1, files.size(), 'Should find 1 test file, which was made in the TestSetup block');
        System.assertEquals('Test File', files[0].Title, 'Files name should be the same');
    }

        @isTest
    static void testGetSalesforceFileBase64() {
        // Get the test file from the database
        ContentVersion testFile = [SELECT Id FROM ContentVersion LIMIT 1];

        Test.startTest();
        String base64Data = DeepLTranslationController.getSalesforceFileBase64(testFile.Id);
        Test.stopTest();

        System.assertNotEquals(null, base64Data, 'The contents of Base64 should not be empty');
    }
}