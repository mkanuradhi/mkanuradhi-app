"use client";
import React from 'react';
import Image from 'next/image';
import anuImage from "@/public/images/anuradha.png";
import { motion } from 'framer-motion';
import './MainImageDisplayer.scss';

const MainImageDisplayer = () => {
  return (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0 }} // Start 50px below and invisible
        animate={{ y: 0, opacity: 1 }}  // Animate to the original position and full opacity
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Image src={anuImage} alt="Anuradha" priority quality={75} className="main-image" />
      </motion.div>
    </>
  )
}

export default MainImageDisplayer