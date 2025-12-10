import { parse, isValid } from 'date-fns';

export const parseReceiptText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    // 1. Amount Extraction
    // Look for largest number with 2 decimals, often near "Total", "Grand Total", "Amount"
    const amountRegex = /[\d,]+\.\d{2}/g;
    let maxAmount = 0;
    let detectedAmount = null;

    // First pass: look for lines with "Total"
    const totalLines = lines.filter(l => /total|amount|net|payable/i.test(l));

    const extractAmount = (line) => {
        const matches = line.match(amountRegex);
        if (matches) {
            matches.forEach(m => {
                const val = parseFloat(m.replace(/,/g, ''));
                if (val > maxAmount && val < 1000000) { // Sanity check
                    maxAmount = val;
                    detectedAmount = val;
                }
            });
        }
    };

    totalLines.forEach(extractAmount);

    // Fallback: scan all lines if no total found
    if (!detectedAmount) {
        lines.forEach(extractAmount);
    }

    // 2. Date Extraction
    // Formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD MMM YYYY
    const dateRegex = /(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})|(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i;
    let detectedDate = null;

    for (const line of lines) {
        const match = line.match(dateRegex);
        if (match) {
            const dateStr = match[0];
            // Try parsing common formats
            const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd', 'dd MMM yyyy', 'dd.MM.yyyy'];
            for (const fmt of formats) {
                const parsed = parse(dateStr, fmt, new Date());
                if (isValid(parsed)) {
                    detectedDate = parsed.toISOString();
                    break;
                }
            }
            if (detectedDate) break;
        }
    }

    // 3. Vendor Extraction
    // Heuristic: Usually the first non-empty line, or first line with > 3 chars
    let detectedVendor = "Unknown Merchant";
    for (const line of lines) {
        if (line.length > 3 && !/date|time|phone|gst|total|invoice/i.test(line)) {
            detectedVendor = line;
            break;
        }
    }

    return {
        amount: detectedAmount ? detectedAmount.toFixed(2) : '',
        date: detectedDate || new Date().toISOString(),
        vendor: detectedVendor,
        rawText: text
    };
};
