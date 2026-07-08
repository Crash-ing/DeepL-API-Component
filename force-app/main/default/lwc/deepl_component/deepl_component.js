import { LightningElement, track } from 'lwc';
import translateText from '@salesforce/apex/DeepLTranslationController.translateText';
import uploadDocumentToDeepL from '@salesforce/apex/DeepLTranslationController.uploadDocumentToDeepL';

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

    // Event handler for language selection changes

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

    // Translation logic

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

    processFileTranslation() {
        console.log('Starting file translation: ', this.fileName);
    }

    handleFileSelected(event) {
        // Check if a file has been selected
        if (event.target.file.length > 0) {
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
}