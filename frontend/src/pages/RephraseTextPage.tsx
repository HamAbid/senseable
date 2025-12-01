import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from '../components/Common/Header';
import Button from '../components/Common/Button';
import TextEditor from '../components/RephraseText/TextEditor';
import SuggestionsPanel, { SuggestionsPanelRef } from '../components/RephraseText/SuggestionsPanel';
import ProfileEdit from '../components/RephraseText/ProfileEdit';
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
  const [hoveredHighlightId, setHoveredHighlightId] = useState<string | null>(null);
  const [acceptedReplacements, setAcceptedReplacements] = useState<Map<number, string>>(new Map());
  const [activeTab, setActiveTab] = useState<'tags' | 'profile'>('tags');

  const suggestionsPanelRef = useRef<SuggestionsPanelRef>(null);

  const colorPalette = preferences?.color_palette || defaultColorPalette;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Re-render highlights when color palette changes (e.g., accessibility settings updated)
  useEffect(() => {
    // Force re-render of TextEditor component when colorPalette changes
    if (isAnalyzed && highlights.length > 0) {
      // Trigger a re-render by creating new array reference
      setHighlights([...highlights]);
    }
  }, [colorPalette]);

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
    setAcceptedReplacements(new Map());
    setHoveredHighlightId(null);
  };

  const handleAccept = (phrase: string, replacement: string) => {
    // Find the highlight for this phrase
    const highlight = highlights.find(h => h.text === phrase);
    if (!highlight) return;

    // Replace the text
    const newText = originalText.replace(phrase, replacement);
    setOriginalText(newText);

    // Calculate the length difference
    const lengthDiff = replacement.length - phrase.length;

    // Update all subsequent highlights' positions
    const updatedHighlights = highlights
      .filter(h => h.id !== highlight.id) // Remove the accepted highlight
      .map(h => {
        if (h.start > highlight.start) {
          // Adjust positions for highlights after the replaced text
          return {
            ...h,
            start: h.start + lengthDiff,
            end: h.end + lengthDiff,
          };
        }
        return h;
      });

    setHighlights(updatedHighlights);

    // Update suggestions to remove the accepted one
    setSuggestions(suggestions.filter(s => s.phrase !== phrase));
  };

  const handleIgnore = (phrase: string) => {
    // Find and remove the highlight
    const highlight = highlights.find(h => h.text === phrase);
    if (highlight) {
      setHighlights(highlights.filter(h => h.id !== highlight.id));
    }

    // Remove the suggestion
    setSuggestions(suggestions.filter(s => s.phrase !== phrase));
  };

  const handleHighlightClick = (highlightId: string) => {
    // Scroll to the corresponding suggestion
    suggestionsPanelRef.current?.scrollToSuggestion(highlightId);
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
                  hoveredHighlightId={hoveredHighlightId}
                  onHighlightHover={setHoveredHighlightId}
                  acceptedReplacements={acceptedReplacements}
                  onHighlightClick={handleHighlightClick}
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

          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-8 lg:max-h-[calc(100vh-6rem)] lg:flex lg:flex-col">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('tags')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'tags'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Tags
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'profile'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Update Profile
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'tags' && (
                <div className="space-y-4">
                  {/* Tag Summary - Compact version at top */}
                  {isAnalyzed && (
              <div className="bg-white rounded-lg shadow p-3 lg:sticky lg:top-0 lg:z-10">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Tag Summary</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded"
                       style={{ backgroundColor: `${colorPalette['not-familiar']}10` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded"
                           style={{ backgroundColor: colorPalette['not-familiar'] }}></div>
                      <span className="text-xs font-medium">Not Familiar</span>
                    </div>
                    <span className="text-sm font-bold">{tagCounts['not-familiar'] || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded"
                       style={{ backgroundColor: `${colorPalette['somewhat-familiar']}10` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded"
                           style={{ backgroundColor: colorPalette['somewhat-familiar'] }}></div>
                      <span className="text-xs font-medium">Somewhat Familiar</span>
                    </div>
                    <span className="text-sm font-bold">{tagCounts['somewhat-familiar'] || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded"
                       style={{ backgroundColor: `${colorPalette['familiar']}10` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded"
                           style={{ backgroundColor: colorPalette['familiar'] }}></div>
                      <span className="text-xs font-medium">Familiar</span>
                    </div>
                    <span className="text-sm font-bold">{tagCounts['familiar'] || 0}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Total Tagged</span>
                    <span className="text-lg font-bold text-primary">{highlights.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rephrase Suggestions - Below summary */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Rephrase Suggestions
                </h3>
                <SuggestionsPanel
                  ref={suggestionsPanelRef}
                  suggestions={suggestions}
                  highlights={highlights}
                  onAccept={handleAccept}
                  onIgnore={handleIgnore}
                  onHover={setHoveredHighlightId}
                  hoveredId={hoveredHighlightId}
                  colorPalette={colorPalette}
                />
              </div>
            )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Update Profile</h3>
                  <ProfileEdit />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RephraseTextPage;
