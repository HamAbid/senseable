import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Suggestion, TextHighlight } from '../../types';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  highlights: TextHighlight[];
  onAccept: (phrase: string, replacement: string) => void;
  onIgnore: (phrase: string) => void;
  onHover: (highlightId: string | null) => void;
  hoveredId: string | null;
  colorPalette: any;
}

export interface SuggestionsPanelRef {
  scrollToSuggestion: (highlightId: string) => void;
}

const SuggestionsPanel = forwardRef<SuggestionsPanelRef, SuggestionsPanelProps>(({
  suggestions,
  highlights,
  onAccept,
  onIgnore,
  onHover,
  hoveredId,
  colorPalette,
}, ref) => {
  const suggestionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToSuggestion: (highlightId: string) => {
      const element = suggestionRefs.current.get(highlightId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }));

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => {
        // Get the tag color for this suggestion
        const tagColor = suggestion.tag ? colorPalette[suggestion.tag] : '#6B7280';
        const firstAlternative = suggestion.alternatives[0] || suggestion.phrase;

        // Find the corresponding highlight
        const highlight = highlights.find(h => h.text === suggestion.phrase);
        const isHovered = highlight && hoveredId === highlight.id;

        return (
          <div
            key={index}
            ref={(el) => {
              if (el && highlight) {
                suggestionRefs.current.set(highlight.id, el);
              }
            }}
            className={`border rounded-lg p-4 space-y-3 transition-all cursor-pointer ${
              isHovered ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onMouseEnter={() => highlight && onHover(highlight.id)}
            onMouseLeave={() => onHover(null)}
          >
            {/* Original -> Alternative format */}
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: tagColor,
                  color: '#000000'
                }}
              >
                {suggestion.phrase}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-sm font-medium text-gray-800">
                {firstAlternative}
              </span>
            </div>

            {/* Explanation */}
            {suggestion.explanation && (
              <div className="text-xs text-gray-600 leading-relaxed">
                {suggestion.explanation}
              </div>
            )}

            {/* Accept and Ignore buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onAccept(suggestion.phrase, firstAlternative)}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition"
              >
                Accept
              </button>
              <button
                onClick={() => onIgnore(suggestion.phrase)}
                className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded transition"
              >
                Ignore
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
});

SuggestionsPanel.displayName = 'SuggestionsPanel';

export default SuggestionsPanel;
