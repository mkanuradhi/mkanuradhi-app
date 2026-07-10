"use client";
import { Button } from "react-bootstrap";
import "./GlowButton.scss";

interface GlowButtonProps {
  withShadow?: boolean;
  clrOne?: string;
  clrTwo?: string;
  children: React.ReactNode;
}

const GlowButton: React.FC<GlowButtonProps> = ({ withShadow = false, clrOne, clrTwo, children }) => {
  const style = clrOne
    ? ({
        "--glow-clr-one": clrOne,
        "--glow-clr-two": clrTwo || `color-mix(in srgb, ${clrOne}, white 35%)`,
      } as React.CSSProperties)
    : undefined;

  return (
    <>
      <Button value="" className="glow-button" style={style}>
        {children}
      </Button>
    </>
  )
}

export default GlowButton;