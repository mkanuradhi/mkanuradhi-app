"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import "./rich-text-editor.scss";

// Dynamically import ReactQuill (client-side only)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  // Define Quill modules and formats as needed
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

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;