import Tesseract from 'tesseract.js';

const SENSITIVE_KEYWORDS = [
    'account no', 'account number', 'ac no',
    'ifsc', 'cif', 'customer id', 'micr',
    'branch code', 'mobile no', 'phone no',
    'pan', 'aadhaar', 'ssn'
];

// Regex for 10-16 digit numbers (potential account/card numbers)
const SENSITIVE_NUMBER_REGEX = /\b\d{10,16}\b/g;

export const validateImage = async (imageFile) => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imageFile,
            'eng',
            { logger: m => console.log(m) } // Optional logger
        );

        const lowerText = text.toLowerCase();
        const detectedIssues = [];

        // Check for keywords
        SENSITIVE_KEYWORDS.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                detectedIssues.push(`Found restricted keyword: "${keyword}"`);
            }
        });

        // Check for long number sequences
        const numberMatches = text.match(SENSITIVE_NUMBER_REGEX);
        if (numberMatches) {
            detectedIssues.push(`Found potential sensitive number sequence (${numberMatches.length} detected)`);
        }

        const isValid = detectedIssues.length === 0;

        return {
            isValid,
            detectedIssues,
            text // Return text for debugging or further checks if needed
        };

    } catch (error) {
        console.error("Privacy validation error:", error);
        throw new Error("Failed to validate image privacy.");
    }
};
