"use client";
import { useTheme } from "@/hooks/useTheme";
import { getContrastTextColor, getGradientColors } from "@/utils/common-utils";
import { useMemo } from "react";
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
  const { theme } = useTheme();

  const customStyle = useMemo(() => {
    // Return quartile colors if available, otherwise generate gradient colors
    return QUARTILE_COLORS[tag as keyof typeof QUARTILE_COLORS] || (() => {
      const [color1, color2] = getGradientColors(tag, 'analogous', theme);
      const textColor = getContrastTextColor(color1);
      return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        color: textColor,
        border: 'none'
      };
    })();
  }, [tag, theme]);

  return (
    <Badge
      pill
      bg=""
      style={customStyle}
      className="me-1"
    >
      {tag}
    </Badge>
  );
}

export default PublicationTagBadge;