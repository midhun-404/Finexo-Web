import Tesseract from 'tesseract.js';

export const ocrService = {
    /**
     * Preprocess image for better OCR results
     * (Simple grayscale and contrast adjustment)
     */
    preprocessImage: async (imageFile) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Grayscale
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }

                ctx.putImageData(imageData, 0, 0);
                canvas.toBlob(resolve, 'image/png');
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(imageFile);
        });
    },

    /**
     * Scan image using Tesseract.js
     */
    scanImage: async (imageFile, onProgress) => {
        try {
            const processedBlob = await ocrService.preprocessImage(imageFile);

            const result = await Tesseract.recognize(
                processedBlob,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text' && onProgress) {
                            onProgress(m.progress * 100);
                        }
                    }
                }
            );

            return {
                text: result.data.text,
                confidence: result.data.confidence
            };
        } catch (error) {
            console.error("OCR Error:", error);
            throw new Error("Failed to scan image.");
        }
    }
};
