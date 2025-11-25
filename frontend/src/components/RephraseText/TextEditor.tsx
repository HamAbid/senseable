import React, { useState, useRef, useEffect } from 'react';
import { TextHighlight, FamiliarityLevel } from '../../types';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  highlights: TextHighlight[];
  onAddHighlight: (highlight: TextHighlight) => void;
  onUpdateHighlight?: (id: string, level: FamiliarityLevel) => void;
  onRemoveHighlight?: (id: string) => void;
  colorPalette: any;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onTextChange,
  highlights,
  onAddHighlight,
  onUpdateHighlight,
  onRemoveHighlight,
  colorPalette,
}) => {
  const [selectedText, setSelectedText] = useState<{ text: string; start: number; end: number } | null>(null);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [editingHighlight, setEditingHighlight] = useState<TextHighlight | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setShowTagMenu(false);
        setShowEditMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setShowTagMenu(false);
      return;
    }

    const selectedStr = selection.toString();
    const range = selection.getRangeAt(0);
    
    // Calculate position within the text
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editorRef.current!);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    const rect = range.getBoundingClientRect();
    
    setSelectedText({
      text: selectedStr,
      start: start,
      end: start + selectedStr.length,
    });

    setMenuPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });

    setShowTagMenu(true);
    setShowEditMenu(false);
  };

  const handleHighlightClick = (e: React.MouseEvent, highlight: TextHighlight) => {
    e.stopPropagation();
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setEditingHighlight(highlight);
    setMenuPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowEditMenu(true);
    setShowTagMenu(false);
  };

  const handleAddTag = (level: FamiliarityLevel) => {
    if (!selectedText) return;

    const highlight: TextHighlight = {
      id: `highlight-${Date.now()}`,
      start: selectedText.start,
      end: selectedText.end,
      text: selectedText.text,
      familiarityLevel: level,
    };

    onAddHighlight(highlight);
    setShowTagMenu(false);
    setSelectedText(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleUpdateTag = (level: FamiliarityLevel) => {
    if (editingHighlight && onUpdateHighlight) {
      onUpdateHighlight(editingHighlight.id, level);
    }
    setShowEditMenu(false);
    setEditingHighlight(null);
  };

  const handleRemoveTag = () => {
    if (editingHighlight && onRemoveHighlight) {
      onRemoveHighlight(editingHighlight.id);
    }
    setShowEditMenu(false);
    setEditingHighlight(null);
  };

  const renderTextWithHighlights = () => {
    if (highlights.length === 0) return text;

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (lastIndex < highlight.start) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      const backgroundColor = colorPalette[highlight.familiarityLevel || 'familiar'];
      parts.push(
        <mark
          key={highlight.id}
          onClick={(e) => handleHighlightClick(e, highlight)}
          style={{ 
            backgroundColor, 
            padding: '2px 4px',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
          className="transition hover:opacity-80"
          title={`Click to edit - ${highlight.familiarityLevel?.replace('-', ' ')}`}
        >
          {text.slice(highlight.start, highlight.end)}
        </mark>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  return (
    <div className="relative" ref={editorRef}>
      <div
        className="w-full min-h-[300px] p-4 border-2 border-gray-300 rounded-lg focus-within:border-primary transition bg-white text-lg leading-relaxed"
        onMouseUp={handleTextSelect}
        style={{ userSelect: 'text', cursor: 'text' }}
      >
        {renderTextWithHighlights()}
      </div>

      {/* Tag Menu - For new selections */}
      {showTagMenu && (
        <div
          className="fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-2 min-w-[200px]"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-xs font-semibold text-gray-500 mb-2 px-2">ADD TAG</div>
          <button
            onClick={() => handleAddTag('not-familiar')}
            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium transition"
            style={{ borderLeft: `4px solid ${colorPalette['not-familiar']}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colorPalette['not-familiar'] }}></div>
              Not at all familiar
            </div>
          </button>
          <button
            onClick={() => handleAddTag('somewhat-familiar')}
            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium transition"
            style={{ borderLeft: `4px solid ${colorPalette['somewhat-familiar']}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colorPalette['somewhat-familiar'] }}></div>
              Somewhat familiar
            </div>
          </button>
          <button
            onClick={() => handleAddTag('familiar')}
            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium transition"
            style={{ borderLeft: `4px solid ${colorPalette['familiar']}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colorPalette['familiar'] }}></div>
              Familiar
            </div>
          </button>
        </div>
      )}

      {/* Edit Menu - For existing highlights */}
      {showEditMenu && editingHighlight && (
        <div
          className="fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-2 min-w-[200px]"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-xs font-semibold text-gray-500 mb-2 px-2">CHANGE TAG</div>
          <button
            onClick={() => handleUpdateTag('not-familiar')}
            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium transition"
            style={{ borderLeft: `4px solid ${colorPalette['not-familiar']}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colorPalette['not-familiar'] }}></div>
              Not at all familiar
            </div>
          </button>
          <button
            onClick={() => handleUpdateTag('somewhat-familiar')}
            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium transition"
            style={{ borderLeft: `4px solid ${colorPalette['somewhat-familiar']}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colorPalette['somewhat-familiar'] }}></div>
              Somewhat familiar
            </div>
          </button>
          <button
            onClick={() => handleUpdateTag('familiar')}
            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium transition"
            style={{ borderLeft: `4px solid ${colorPalette['familiar']}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colorPalette['familiar'] }}></div>
              Familiar
            </div>
          </button>
          <hr className="my-2" />
          <button
            onClick={handleRemoveTag}
            className="block w-full text-left px-3 py-2 hover:bg-red-50 rounded text-sm font-medium text-red-600 transition"
          >
            Remove tag
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
