"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import AccordionCards from "./AccordionCards";
import Switch from "./Switch";
import StyledBtn_1 from "./StyledBtn_1";

const MotionBox = motion(Box);

export default function MonitorToggle({ onBack }) {
  const [isOn, setIsOn] = useState(false);

  const toggleScreen = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <Box
      h="100vh"
      w="100%"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* MONITOR AND ACCORDION WRAPPER */}
      <Box
        position="relative"
        width="1200px"
        height="900px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* SVG MONITOR */}
        <svg
          width="1200"
          height="900"
          viewBox="0 0 400 300"
          style={{ position: "absolute" }}
        >
          {/* FRAME */}
          <rect
            x="50"
            y="50"
            width="300"
            height="200"
            rx="10"
            ry="10"
            fill="#333"
            stroke="#111"
            strokeWidth="2"
          />

          {/* SCREEn */}
          <motion.rect
            x="60"
            y="60"
            width="280"
            height="160"
            rx="5"
            ry="5"
            animate={{
              fill: isOn ? "#00ff88" : "#000",
              filter: isOn ? "drop-shadow(0 0 20px #00ff88)" : "none",
              scale: isOn ? 1 : 0.98,
              opacity: isOn ? 1 : 0.6,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* STAND */}
          <rect x="170" y="250" width="60" height="10" fill="#555" />
          <rect x="150" y="260" width="100" height="10" fill="#444" />
        </svg>

        {/* SWITCH */}
        <Box
          position="absolute"
          top="684px"
          left="50%"
          transform="translateX(-50%)"
          zIndex="2"
        >
          <Switch checked={isOn} onChange={toggleScreen} />
        </Box>

        {/* ACCORDION OVERLAY */}
        <AnimatePresence>
          {isOn && (
            <MotionBox
              position="absolute"
              top="10%"
              left="9%"
              width="82%"
              height="66%"
              overflow="hidden"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <AccordionCards />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      {/* BACK BUTTON */}
      <Box mt={2}>
        <StyledBtn_1 onClick={onBack} />
      </Box>
    </Box>
  );
}
