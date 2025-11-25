import React from 'react';
import { Suggestion } from '../../types';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: string, original: string) => void;
  colorPalette: any;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  suggestions,
  onSelectSuggestion,
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary transition"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-500 mb-1">Original phrase:</div>
              <div className="text-base font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded">
                "{suggestion.phrase}"
              </div>
            </div>
          </div>

          <div className="text-sm font-semibold text-gray-500 mb-2">Simpler alternatives:</div>
          <div className="space-y-2">
            {suggestion.alternatives.map((alt, altIndex) => (
              <button
                key={altIndex}
                onClick={() => onSelectSuggestion(alt, suggestion.phrase)}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium">"{alt}"</span>
                  <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition">
                    Click to use →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsPanel;
