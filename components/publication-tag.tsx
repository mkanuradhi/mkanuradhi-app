"use client";
import { Badge } from "react-bootstrap";

// Quartile colors configuration
const QUARTILE_COLORS = {
  Q1: { backgroundColor: '#60CA46', color: '#fff' }, // Q1 Green
  Q2: { backgroundColor: 'rgb(232, 213, 89)', color: '#fff' }, // Q2 Yellow
  Q3: { backgroundColor: 'rgb(251, 163, 83)', color: '#fff' }, // Q3 Orange
  Q4: { backgroundColor: 'rgb(221, 90, 78)', color: '#fff' }, // Q4 Red
} as const;

interface PublicationTagBadgeProps {
  tag: string;
}

const PublicationTagBadge: React.FC<PublicationTagBadgeProps> = ({ tag }) => {

  const getTagStyle = (tag: string) => {
    return QUARTILE_COLORS[tag as keyof typeof QUARTILE_COLORS] || null;
  };
  const customStyle = getTagStyle(tag);

  return (
    <Badge
      pill 
      bg={customStyle ? '' : 'secondary'}
      style={customStyle || undefined}
      className="me-1"
    >
      {tag}
    </Badge>
  );
}

export default PublicationTagBadge;