import { LightningElement, track } from 'lwc';
import translateText from '@salesforce/apex/DeepLTranslationController.translateText';

export default class Deepl_component extends LightningElement {
    // Translation control choices
    @track selectedSource = '';
    @track selectedTarget = 'EN-US';
    @track selectedFormality = 'default';

    // Text input and output
    @track textToTranslate = '';
    @track translatedText = '';

    // Dropdown options for source and target languages and formality
    get sourceOptions() {
        return [
            { label: 'Auto-detect', value: '' }, // Empty value for auto-detection
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
}