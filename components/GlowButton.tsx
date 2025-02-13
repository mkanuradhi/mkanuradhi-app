"use client";
import { Button } from "react-bootstrap";
import "./GlowButton.scss";

interface GlowButtonProps {
  withShadow?: boolean;
  children: React.ReactNode;
}

const GlowButton: React.FC<GlowButtonProps> = ({ withShadow = false, children }) => {

  return (
    <>
      <Button variant="primary" className="glow-button">
        {children}
      </Button>
    </>
  )
}

export default GlowButton;