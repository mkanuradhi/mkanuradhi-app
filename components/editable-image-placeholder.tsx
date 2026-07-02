"use client";
import React, { useState } from 'react';
import { Link } from '@/i18n/routing';

interface EditableImagePlaceholderProps {
  editHref:  string;
  width:     number;
  height:    number;
  borderRadius?: string;
}

const EditableImagePlaceholder: React.FC<EditableImagePlaceholderProps> = ({
  editHref,
  width,
  height,
  borderRadius = '6px',
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={editHref} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          width,
          height,
          borderRadius:    borderRadius,
          border:          `2px dashed var(--bs-border-color)`,
          background:      hovered ? 'var(--bs-secondary-bg)' : 'transparent',
          color:           'var(--bs-secondary-color)',
          cursor:          'pointer',
          transition:      'background 0.2s ease',
          flexShrink:      0,
        }}
        title="Click to edit image"
      >
        <i className="bi bi-pencil-fill small"></i>
      </div>
    </Link>
  );
};

export default EditableImagePlaceholder;