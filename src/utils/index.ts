// Validate input function
export const convertToArray = (input: string): string[] | false => {
    try {
        const match = input.match(/^\[([^\]]+)\]$/);
        if (match) {
            // Split by commas, ensuring to handle quoted content properly
            return match[1]
                .split(/",?\s*(?![^"]*"[^"]*$)/)  // Split by commas outside of quotes
                .map(item => item.replace(/^"|"$/g, '').trim())  // Remove quotes and trim whitespace
                .filter(item => item !== '');  // Remove empty strings
        }
        return false;
    } catch {
        return false;
    }
};