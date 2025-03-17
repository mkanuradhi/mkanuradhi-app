"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import "./rich-text-editor.scss";
import { Button } from 'react-bootstrap';

// Dynamically import ReactQuill (client-side only)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, placeholder = '', onChange }) => {
  const [showHtml, setShowHtml] = useState(false);
  // htmlContent holds the raw HTML when in HTML view
  const [htmlContent, setHtmlContent] = useState(value);

  useEffect(() => {
    if (!showHtml) {
      setHtmlContent(value);
    }
  }, [value, showHtml]);

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }], 
      [{ 'color': [] }, { 'background': [] }],
      ['link',],
      ['clean'],
    ],
  };

  const formats = [
    'font',
    'size',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'link',
    'color',
    'background',
    'script',
  ];

  const handleToggle = () => {
    if (showHtml) {
      onChange(htmlContent);
    }
    setShowHtml(!showHtml);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <Button onClick={handleToggle} variant="outline-primary" size="sm">
          { showHtml ? <i className="bi bi-type-italic"></i> : <i className="bi bi-code-slash"></i> }
        </Button>
      </div>
      {showHtml ? (
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          rows={10}
          style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem' }}
        />
      ) : (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default RichTextEditor;