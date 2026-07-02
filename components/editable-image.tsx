"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { Link } from '@/i18n/routing';

interface EditableImageProps {
  src:       string;
  alt:       string;
  editHref:  string;
  width:     number;
  height:    number;
  borderRadius?: string;
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  editHref,
  width,
  height,
  borderRadius = '6px',
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative', width, height, borderRadius, overflow: 'hidden', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />

      {/* Overlay */}
      <div style={{
        position:        'absolute',
        inset:           0,
        background:      'rgba(0, 0, 0, 0.5)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        opacity:         hovered ? 1 : 0,
        transition:      'opacity 0.2s ease',
        borderRadius:    borderRadius,
      }}>
        <Link href={editHref}>
          <Button variant="light" size="sm" className="p-1">
            <i className="bi bi-pencil-fill small"></i>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EditableImage;