import Tesseract from 'tesseract.js';

const SENSITIVE_KEYWORDS = [
    'mobile no', 'phone no',
    'pan', 'aadhaar', 'ssn'
];

// Regex for 10-16 digit numbers (potential account/card numbers)
// Regex for 10-16 digit numbers (potential account/card numbers)
// const SENSITIVE_NUMBER_REGEX = /\b\d{10,16}\b/g;

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
