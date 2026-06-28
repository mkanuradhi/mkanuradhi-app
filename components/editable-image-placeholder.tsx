"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@/i18n/routing';

interface EditableImagePlaceholderProps {
  editHref:  string;
  width:     number;
  height:    number;
}

const EditableImagePlaceholder: React.FC<EditableImagePlaceholderProps> = ({
  editHref,
  width,
  height,
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
          borderRadius:    6,
          border:          `2px dashed var(--bs-border-color)`,
          background:      hovered ? 'var(--bs-secondary-bg)' : 'transparent',
          color:           'var(--bs-secondary-color)',
          cursor:          'pointer',
          transition:      'background 0.2s ease',
          flexShrink:      0,
        }}
      >
        <i className="bi bi-pencil-fill"></i>
      </div>
    </Link>
  );
};

export default EditableImagePlaceholder;