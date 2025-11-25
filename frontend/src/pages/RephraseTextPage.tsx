import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from '../components/Common/Header';
import Button from '../components/Common/Button';
import TextEditor from '../components/RephraseText/TextEditor';
import SuggestionsPanel from '../components/RephraseText/SuggestionsPanel';
import { TextHighlight, Suggestion, FamiliarityLevel } from '../types';
import { defaultColorPalette } from '../utils/colorPalettes';
import { mockAnalyzeText, mockGetSuggestions } from '../mocks/analyzeData';

const RephraseTextPage: React.FC = () => {
  const { user, preferences } = useUser();
  const navigate = useNavigate();

  const [originalText, setOriginalText] = useState('');
  const [highlights, setHighlights] = useState<TextHighlight[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const colorPalette = preferences?.color_palette || defaultColorPalette;

  useEffect(() => {
    if (!user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  // Count tags by familiarity level
  const tagCounts = highlights.reduce((acc, h) => {
    if (h.familiarityLevel) {
      acc[h.familiarityLevel] = (acc[h.familiarityLevel] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleAnalyze = () => {
    if (!originalText.trim()) return;

    setLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const analyzed = mockAnalyzeText(originalText);
      setHighlights(analyzed);
      setIsAnalyzed(true);
      setLoading(false);
    }, 800);
  };

  const handleRephrase = () => {
    if (!isAnalyzed) {
      handleAnalyze();
      return;
    }

    setLoading(true);

    // Generate suggestions for each highlighted phrase using mock data
    setTimeout(() => {
      const newSuggestions = mockGetSuggestions(highlights, originalText);
      setSuggestions(newSuggestions);
      setLoading(false);
    }, 800);
  };

  const handleAddHighlight = (highlight: TextHighlight) => {
    setHighlights([...highlights, highlight]);
  };

  const handleUpdateHighlight = (id: string, level: FamiliarityLevel) => {
    setHighlights(highlights.map(h => 
      h.id === id ? { ...h, familiarityLevel: level } : h
    ));
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const handleReset = () => {
    setOriginalText('');
    setHighlights([]);
    setSuggestions([]);
    setIsAnalyzed(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input/Editor */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isAnalyzed ? 'Analyzed Text' : 'Original Text'}
                </h2>
                {isAnalyzed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    Start Over
                  </Button>
                )}
              </div>

              {!isAnalyzed ? (
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="Paste or type the text you want to analyze and rephrase..."
                  className="w-full min-h-[300px] p-4 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none text-lg leading-relaxed"
                />
              ) : (
                <TextEditor
                  text={originalText}
                  onTextChange={setOriginalText}
                  highlights={highlights}
                  onAddHighlight={handleAddHighlight}
                  onUpdateHighlight={handleUpdateHighlight}
                  onRemoveHighlight={handleRemoveHighlight}
                  colorPalette={colorPalette}
                />
              )}

              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleRephrase}
                  disabled={loading || !originalText.trim()}
                  className="flex-1"
                >
                  {loading ? 'Processing...' : isAnalyzed ? 'Get Rephrase Suggestions' : 'Analyze'}
                </Button>
              </div>

              {isAnalyzed && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    💡 <strong>Tip:</strong> Select any text to add or modify tags. Click on highlighted text to change its familiarity level.
                  </p>
                </div>
              )}
            </div>

            {/* Suggestions Panel - Below main editor when suggestions exist */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Rephrase Suggestions
                </h2>
                <SuggestionsPanel
                  suggestions={suggestions}
                  onSelectSuggestion={(suggestion, original) => {
                    const newText = originalText.replace(original, suggestion);
                    setOriginalText(newText);
                  }}
                  colorPalette={colorPalette}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tag Summary */}
            {isAnalyzed && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tag Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg" 
                       style={{ backgroundColor: `${colorPalette['not-familiar']}15` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" 
                           style={{ backgroundColor: colorPalette['not-familiar'] }}></div>
                      <span className="text-sm font-medium">Not Familiar</span>
                    </div>
                    <span className="text-lg font-bold">{tagCounts['not-familiar'] || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg"
                       style={{ backgroundColor: `${colorPalette['somewhat-familiar']}15` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded"
                           style={{ backgroundColor: colorPalette['somewhat-familiar'] }}></div>
                      <span className="text-sm font-medium">Somewhat Familiar</span>
                    </div>
                    <span className="text-lg font-bold">{tagCounts['somewhat-familiar'] || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg"
                       style={{ backgroundColor: `${colorPalette['familiar']}15` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded"
                           style={{ backgroundColor: colorPalette['familiar'] }}></div>
                      <span className="text-sm font-medium">Familiar</span>
                    </div>
                    <span className="text-lg font-bold">{tagCounts['familiar'] || 0}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Total Tagged</span>
                    <span className="text-xl font-bold text-primary">{highlights.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Color Legend */}
            {isAnalyzed && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" 
                         style={{ backgroundColor: colorPalette['not-familiar'] }}></div>
                    <span>Not at all familiar (Red)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded"
                         style={{ backgroundColor: colorPalette['somewhat-familiar'] }}></div>
                    <span>Somewhat familiar (Yellow)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded"
                         style={{ backgroundColor: colorPalette['familiar'] }}></div>
                    <span>Familiar (Green)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RephraseTextPage;
