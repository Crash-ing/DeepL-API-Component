import { LightningElement, track, wire } from 'lwc';
import translateText from '@salesforce/apex/DeepLTranslationController.translateText';
import uploadDocumentToDeepL from '@salesforce/apex/DeepLTranslationController.uploadDocumentToDeepL';
import checkDocumentStatus from '@salesforce/apex/DeepLTranslationController.checkDocumentStatus';
import downloadDocument from '@salesforce/apex/DeepLTranslationController.downloadDocument';
import getRecentSalesforceFiles from '@salesforce/apex/DeepLTranslationController.getRecentSalesforceFiles';
import getSalesforceFileBase64 from '@salesforce/apex/DeepLTranslationController.getSalesforceFileBase64';

export default class Deepl_component extends LightningElement {
    // Translation control choices
    @track selectedSource = '';
    @track selectedTarget = 'EN-US';
    @track selectedFormality = 'default';

    // Text input and output
    @track textToTranslate = '';
    @track translatedText = '';

    // File upload
    @track fileName=' ';
    @track base64FileData = null;

    // Salesforce files
    @track sfFileOptions = [];
    @track selectedSfFile = '';

    // Dropdown options for source and target languages and formality
    get sourceOptions() {
        return [
            { label: 'Auto-detect', value: '' },    // Empty value for auto-detection
            { label: 'Bulgarian (BG)', value: 'BG' },
            { label: 'Chinese (ZH)', value: 'ZH' },
            { label: 'Czech (CS)', value: 'CS' },
            { label: 'Danish (DA)', value: 'DA' },
            { label: 'Dutch (NL)', value: 'NL' },
            { label: 'English (EN)', value: 'EN' },
            { label: 'Estonian (ET)', value: 'ET' },
            { label: 'Finnish (FI)', value: 'FI' },
            { label: 'French (FR)', value: 'FR' },
            { label: 'German (DE)', value: 'DE' },
            { label: 'Greek (EL)', value: 'EL' },
            { label: 'Hungarian (HU)', value: 'HU' },
            { label: 'Italian (IT)', value: 'IT' },
            { label: 'Japanese (JA)', value: 'JA' },
            { label: 'Korean (KO)', value: 'KO' },
            { label: 'Latvian (LV)', value: 'LV' },
            { label: 'Lithuanian (LT)', value: 'LT' },
            { label: 'Norwegian Bokmål (NB)', value: 'NB' },
            { label: 'Polish (PL)', value: 'PL' },
            { label: 'Portuguese (PT)', value: 'PT' },
            { label: 'Romanian (RO)', value: 'RO' },
            { label: 'Russian (RU)', value: 'RU' },
            { label: 'Slovak (SK)', value: 'SK' },
            { label: 'Slovenian (SL)', value: 'SL' },
            { label: 'Spanish (ES)', value: 'ES' },
            { label: 'Swedish (SV)', value: 'SV' },
            { label: 'Turkish (TR)', value: 'TR' },
            { label: 'Ukrainian (UK)', value: 'UK' }
        ];
    }
    
    get targetOptions() {
        return [
            { label: 'Bulgarian (BG)', value: 'BG' },
            { label: 'Chinese (ZH)', value: 'ZH' },
            { label: 'Czech (CS)', value: 'CS' },
            { label: 'Danish (DA)', value: 'DA' },
            { label: 'Dutch (NL)', value: 'NL' },
            { label: 'English - British (EN-GB)', value: 'EN-GB' },
            { label: 'English - American (EN-US)', value: 'EN-US' },
            { label: 'Estonian (ET)', value: 'ET' },
            { label: 'Finnish (FI)', value: 'FI' },
            { label: 'French (FR)', value: 'FR' },
            { label: 'German (DE)', value: 'DE' },
            { label: 'Greek (EL)', value: 'EL' },
            { label: 'Hungarian (HU)', value: 'HU' },
            { label: 'Italian (IT)', value: 'IT' },
            { label: 'Japanese (JA)', value: 'JA' },
            { label: 'Korean (KO)', value: 'KO' },
            { label: 'Latvian (LV)', value: 'LV' },
            { label: 'Lithuanian (LT)', value: 'LT' },
            { label: 'Norwegian Bokmål (NB)', value: 'NB' },
            { label: 'Polish (PL)', value: 'PL' },
            { label: 'Portuguese - Brazilian (PT-BR)', value: 'PT-BR' },
            { label: 'Portuguese - European (PT-PT)', value: 'PT-PT' },
            { label: 'Romanian (RO)', value: 'RO' },
            { label: 'Russian (RU)', value: 'RU' },
            { label: 'Slovak (SK)', value: 'SK' },
            { label: 'Slovenian (SL)', value: 'SL' },
            { label: 'Spanish (ES)', value: 'ES' },
            { label: 'Swedish (SV)', value: 'SV' },
            { label: 'Turkish (TR)', value: 'TR' },
            { label: 'Ukrainian (UK)', value: 'UK' }
        ];
    }

    get formalityOptions() {
        return [
            { label: 'Default', value: 'default' },
            { label: 'Formal', value: 'prefer_more' },
            { label: 'Informal', value: 'prefer_less' }
        ];
    }

    // Event handlers for language selection changes
    handleSourceChange(event) {
        this.selectedSource = event.detail.value;
    }

    handleTargetChange(event) {
        this.selectedTarget = event.detail.value;
    }

    handleFormalityChange(event) {
        this.selectedFormality = event.detail.value;
    }

    handleSourceTextChange(event) {
        this.textToTranslate = event.target.value;
    }

    handleTargetTextChange(event) {
        this.translatedText = event.target.value;
    }

    // ================================
    //        TRANSLATION LOGIC
    // ================================

    handleTranslateClick() {
        // Check if file has been uploaded
        if (this.base64FileData) {
            this.translatedText = 'Uploading file to DeepL... Please wait.';
            this.processFileTranslation();
        }
        // If no file has been uploaded, translate text
        else if (this.textToTranslate) {
            translateText({
            textToTranslate: this.textToTranslate,
            targetLanguage: this.selectedTarget,
            sourceLanguage: this.selectedSource,
            formality: this.selectedFormality
            })
            .then (result => {
                let jsonResponse = JSON.parse(result);
                this.translatedText = jsonResponse.translations[0].text;
            })
            .catch(error => {
                console.error('Error during translation: ', error);
                this.translatedText = 'Error during translation. Please try again.';
            });
        }
        // if nothing has been uploaded, do nothing
        else {
            return;
        }
    }

    // ================================
    //     FILE TRANSLATION LOGIC
    // ================================

    // Handle file selection from the user's local machine
    handleFileSelected(event) {
        // Check if a file has been selected
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.fileName = file.name;

            // Create a file reader
            let reader = new FileReader();
            reader.onload = () => {
                // Get necessary data from the URL
                let base64 = reader.result.split(',')[1];
                this.base64FileData = base64;

                console.log('File read successfully! File Name: ' + this.fileName);
            };

            // Reads file as a Base64 text string
            reader.readAsDataURL(file);
        }
    }

    // Process the file translation by uploading it to DeepL and checking its status
    processFileTranslation() {
        console.log('Starting file translation: ', this.fileName);

        uploadDocumentToDeepL({
            base64FileData: this.base64FileData,
            fileName: this.fileName,
            targetLanguage: this.selectedTarget,
            sourceLanguage: this.selectedSource
        })
        .then(result => {
            let response = JSON.parse(result);
            this.translatedText = 'File sent! Waiting for translation...';

            // Start checking the translation status
            this.checkTranslationStatus(response.document_id, response.document_key);
        })
        .catch(error => {
            console.error('Error during file upload: ', error);
            this.translatedText = 'Error during file upload. Please try again.';
        });
    }

    // Check the translation status of the uploaded document
    checkTranslationStatus(docId, docKey) {
        checkDocumentStatus({ documentId: docId, documentKey: docKey })
        .then(result => {
            let statusResponse = JSON.parse(result);
            console.log('Current status: ', statusResponse.status);

            if (statusResponse.status === 'done') {
                this.translatedText = 'Translation completed! Downloading...';
                this.downloadTranslatedFile(docId, docKey);
            } else if (statusResponse.status === 'error') {
                this.translatedText = 'Error during translation. Please try again.';
            } else {
                // if status is 'pending' or 'translating', check again after 3 seconds
                this.translatedText = 'File is being translated (' + statusResponse.status + ')...';
                setTimeout(() => {
                    this.checkTranslationStatus(docId, docKey);
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error checking translation status: ', error);
            this.translatedText = 'Error checking translation status. Please try again.';
        });
    }

    // Download the translated file from DeepL and trigger a download in the browser
    downloadTranslatedFile (docId, docKey) {
        downloadDocument({ documentId: docId, documentKey: docKey })
        .then(base64Result => {
            const downloadLink = document.createElement('a');                                       // Create a temporary anchor element for downloading
            downloadLink.href = 'data:application/octet-stream;base64,' + base64Result;             // Assuming the translated file is a binary file
            downloadLink.download = 'Translated_' + this.selectedTarget + '_' + this.fileName;      // Set the download filename
            downloadLink.click();                                                                   // Trigger the download

            this.translatedText = 'File downloaded successfully!';
            this.base64FileData = null;
        })
        .catch(error => {
            console.error('Error downloading translated file: ', error);
            this.translatedText = 'Error downloading translated file. Please try again.';
        })
    }

    // ==========================================
    //      SALESFORCE FILE SELECTION LOGIC
    // ==========================================

    // Fetch recent Salesforce files for selection
    @wire(getRecentSalesforceFiles)
    wiredFiles({ error, data }) {
        if (data) {
            // Map the fetched files to the format suitable for the dropdown
            this.sfFileOptions = data.map(file => {
                return {
                    label: file.Title + '.' + file.FileExtension,
                    value: file.Id
                };
            });
        } else if (error) {
            console.error('Error fetching Salesforce files: ', error);
        }
    }

    // Handle Salesforce file selection change
    handleSfFileChange(event) {
        this.selectedSfFile = event.detail.value;

        // Find the selected file's label for display
        let selectedOption = this.sfFileOptions.find(opt => opt.value === this.selectedSfFile);
        if (selectedOption) {
            this.fileName = selectedOption.label;
        }

        this.translatedText = 'Fetching file from Salesforce... Please wait.';

        // Fetch the Base64 content of the selected Salesforce file
        getSalesforceFileBase64({ contentVersionId: this.selectedSfFile })
            .then(base64Data => {
                this.base64FileData = base64Data;
                this.translatedText = 'Salesforce file fetched successfully! Ready for translation.';
            })
            .catch(error => {
                console.error('Error fetching data from file: ', error);
                this.translatedText = 'Error fetching data from Salesforce file. Please try again.';
            });
    }
}