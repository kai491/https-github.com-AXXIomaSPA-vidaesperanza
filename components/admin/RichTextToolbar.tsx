
import React from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onContentChange: (newContent: string) => void;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ textareaRef, onContentChange }) => {
  const wrapSelection = (tag: 'strong' | 'em') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = `${textarea.value.substring(0, start)}<${tag}>${selectedText}</${tag}>${textarea.value.substring(end)}`;
    
    onContentChange(newText);
  };

  const formatList = (type: 'ul' | 'ol') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (!selectedText) {
        alert("Selecciona las líneas de texto que quieres convertir en una lista.");
        return;
    }

    const listItems = selectedText.split('\n').map(line => `  <li>${line.trim()}</li>`).join('\n');
    const listHtml = `<${type}>\n${listItems}\n</${type}>`;
    
    const newText = `${textarea.value.substring(0, start)}${listHtml}${textarea.value.substring(end)}`;
    onContentChange(newText);
  };

  const buttons = [
    { label: 'Negrita', icon: <Bold size={16} />, action: () => wrapSelection('strong') },
    { label: 'Cursiva', icon: <Italic size={16} />, action: () => wrapSelection('em') },
    { label: 'Lista', icon: <List size={16} />, action: () => formatList('ul') },
    { label: 'Lista Numerada', icon: <ListOrdered size={16} />, action: () => formatList('ol') },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 border border-b-0 border-gray-200 rounded-t-lg p-1">
      {buttons.map((btn, i) => (
        <button key={i} type="button" onClick={btn.action} title={btn.label} className="p-2 rounded hover:bg-gray-200 text-gray-600">
            {btn.icon}
        </button>
      ))}
      <span className="text-xs text-gray-400 ml-auto pr-2">Selecciona texto para formatear</span>
    </div>
  );
};
