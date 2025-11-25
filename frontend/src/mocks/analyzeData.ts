import { TextHighlight, Suggestion, FamiliarityLevel } from '../types';
import exampleTextsData from './exampleTexts.json';

/**
 * Mock data for text analysis and rephrase suggestions
 * Loads from JSON file for easy demo content management
 */

// Map JSON tag names to FamiliarityLevel type
const tagMapping: Record<string, FamiliarityLevel> = {
  'not_familiar': 'not-familiar',
  'somewhat_familiar': 'somewhat-familiar',
  'familiar': 'familiar',
};

/**
 * Get example text by ID (defaults to first example)
 */
export const getExampleById = (id: number = 1) => {
  return exampleTextsData.examples.find(ex => ex.id === id) || exampleTextsData.examples[0];
};

/**
 * Get all available examples
 */
export const getAllExamples = () => {
  return exampleTextsData.examples;
};

/**
 * Convert JSON tagged phrases to TextHighlight format
 */
export const getHighlightsFromExample = (exampleId: number = 1): TextHighlight[] => {
  const example = getExampleById(exampleId);
  
  return example.tagged_phrases.map((phrase, index) => ({
    id: `highlight-${index}-${phrase.start_index}`,
    start: phrase.start_index,
    end: phrase.end_index,
    text: phrase.phrase,
    familiarityLevel: tagMapping[phrase.tag],
  }));
};

/**
 * Get suggestions from JSON example data
 */
export const getSuggestionsFromExample = (exampleId: number = 1): Suggestion[] => {
  const example = getExampleById(exampleId);
  
  return example.tagged_phrases.map(phrase => ({
    phrase: phrase.phrase,
    alternatives: phrase.rephrased_versions.map(v => v.replacement),
    position: { start: phrase.start_index, end: phrase.end_index },
  }));
};

/**
 * Analyzes text and returns highlights for complex phrases
 * Uses JSON data if text matches an example, otherwise uses fallback logic
 */
export const mockAnalyzeText = (text: string): TextHighlight[] => {
  // Check if this text matches any example
  const matchingExample = exampleTextsData.examples.find(
    ex => ex.original_text.trim() === text.trim()
  );
  
  if (matchingExample) {
    return getHighlightsFromExample(matchingExample.id);
  }
  
  // Fallback: simple phrase detection for custom text
  return detectComplexPhrases(text);
};

/**
 * Generates rephrase suggestions for highlighted phrases
 */
export const mockGetSuggestions = (highlights: TextHighlight[], text: string): Suggestion[] => {
  // Check if this text matches any example
  const matchingExample = exampleTextsData.examples.find(
    ex => ex.original_text.trim() === text.trim()
  );
  
  if (matchingExample) {
    return getSuggestionsFromExample(matchingExample.id);
  }
  
  // Fallback: generate generic suggestions
  return highlights.map(h => ({
    phrase: h.text,
    alternatives: [
      `simpler version of "${h.text}"`,
      `easier "${h.text}"`
    ],
    position: { start: h.start, end: h.end },
  }));
};

/**
 * Fallback phrase detection for non-example text
 */
const detectComplexPhrases = (text: string): TextHighlight[] => {
  const highlights: TextHighlight[] = [];
  const lowerText = text.toLowerCase();
  
  const fallbackPhrases = [
    { text: 'large language model', level: 'not-familiar' as FamiliarityLevel },
    { text: 'LLM agents', level: 'not-familiar' as FamiliarityLevel },
    { text: 'composable patterns', level: 'somewhat-familiar' as FamiliarityLevel },
    { text: 'complex frameworks', level: 'somewhat-familiar' as FamiliarityLevel },
    { text: 'specialized libraries', level: 'familiar' as FamiliarityLevel },
    { text: 'implementations', level: 'familiar' as FamiliarityLevel },
  ];
  
  fallbackPhrases.forEach((phrase, index) => {
    const searchText = phrase.text.toLowerCase();
    let startIndex = 0;
    
    while (startIndex < lowerText.length) {
      const start = lowerText.indexOf(searchText, startIndex);
      if (start === -1) break;
      
      highlights.push({
        id: `highlight-${index}-${start}`,
        start,
        end: start + phrase.text.length,
        text: text.slice(start, start + phrase.text.length),
        familiarityLevel: phrase.level,
      });
      
      startIndex = start + phrase.text.length;
    }
  });

  return highlights.sort((a, b) => a.start - b.start);
};
