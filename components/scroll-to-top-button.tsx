"use client";
import { Button } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./scroll-to-top-button.scss"

interface ScrollToTopButtonProps {
  threshold?: number;
  bottom?: string;
  right?: string;
  ariaLabel?: string;
  title?: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  threshold = 200,
  bottom = "5rem",
  right = "1rem",
  ariaLabel = "Scroll to top",
  title = "Scroll to top",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom,
            right,
            zIndex: 1000,
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            className="scroll-to-top-btn"
            onClick={handleClick}
            aria-label={ariaLabel}
            title={title}
          >
            <i className="bi bi-chevron-up"></i>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
