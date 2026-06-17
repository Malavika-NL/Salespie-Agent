export function generateAbbreviation(name: string | null): string {
    if (!name) return 'NA';
    
    const words = name.trim().split(/\s+/); // Split by spaces, handling extra spaces

    if (words.length > 1) {
        return words.map(word => word[0]).join('').toUpperCase(); // First letter of each word
    } else {
        const singleWord = words[0];
        return singleWord.length > 1 
            ? (singleWord[0] + singleWord[singleWord.length - 1]).toUpperCase() 
            : singleWord[0].toUpperCase(); // First + Last letter, or just first if one character
    }
}
