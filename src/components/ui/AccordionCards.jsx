"use client";
import {
  Box,
  Flex,
  Text,
  Image,
  Tooltip,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { keyframes } from "@emotion/react";
import cards from "../../data/projects.json";

// SHAKE ANIMATION
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2%); }
  50% { transform: translateX(2%); }
  75% { transform: translateX(-2%); }
  100% { transform: translateX(0); }
`;

// ARROW STYLES
const arrowStyles = {
  bg: "whiteAlpha.200",
  color: "white",
  fontSize: "2xl",
  borderRadius: "full",
  border: "2px solid white",
  width: { base: "36px", md: "44px" },
  height: { base: "36px", md: "44px" },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 12px rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(6px)",
  transition: "all 0.3s ease",
  _hover: {
    bg: "whiteAlpha.300",
    transform: "scale(1.1)",
    boxShadow: "0 0 16px rgba(255, 255, 255, 0.4)",
  },
  _active: {
    bg: "whiteAlpha.400",
    transform: "scale(0.95)",
  },
};

export default function AccordionCards() {
  const [activeCard, setActiveCard] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [tapTimeout, setTapTimeout] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [lastCardChange, setLastCardChange] = useState(0);
  const visibleCardsCount = useBreakpointValue({ base: 3, md: 5 });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerRef = useRef(null);

  const tooltipText = isMobile
    ? "Tap to interact / Double tap to flip"
    : "Click to interact / SPACE to flip";

  // SMOOTH CAROUSEL FUNCTIONS
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  // WHEEL-LIKE DRAG HANDLING
  const handleDragStart = useCallback((event) => {
    setIsDragging(true);
    setDragStartX(event.clientX || event.touches?.[0]?.clientX || 0);
    setDragOffset(0);
    setDragVelocity(0);
    setLastDragTime(Date.now());
  }, []);

  const handleDragMove = useCallback(
    (event) => {
      if (!isDragging) return;

      const currentX = event.clientX || event.touches?.[0]?.clientX || 0;
      const deltaX = currentX - dragStartX;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastDragTime;

      // Calculate velocity for momentum
      if (deltaTime > 0) {
        const velocity = deltaX / deltaTime;
        setDragVelocity(velocity);
      }

      // Update visual feedback immediately
      setDragOffset(deltaX);
      setLastDragTime(currentTime);

      // Change cards in real-time while dragging
      const dragThreshold = 150; // Pixels to drag before changing card
      const now = Date.now();
      
      // Prevent rapid successive card changes (minimum 300ms between changes)
      if (Math.abs(deltaX) > dragThreshold && (now - lastCardChange) > 300) {
        if (deltaX > 0) {
          // Dragging right -> go to previous card
          handlePrev();
        } else {
          // Dragging left -> go to next card
          handleNext();
        }
        
        // Reset drag start point to allow continuous dragging
        setDragStartX(currentX);
        setDragOffset(0);
        setLastCardChange(now);
      }
    },
    [isDragging, dragStartX, lastDragTime, handleNext, handlePrev, lastCardChange]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // Snap back to center
    setDragOffset(0);
    setDragVelocity(0);
  }, [isDragging]);


  // MOUSE AND TOUCH EVENT HANDLERS
  const handleMouseDown = useCallback((event) => {
    handleDragStart(event);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((event) => {
    handleDragMove(event);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleTouchStart = useCallback((event) => {
    handleDragStart(event);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((event) => {
    handleDragMove(event);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Add global mouse move and mouse up listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleTap = (id, frontHref, backHref) => {
    const now = Date.now();

    if (now - lastTap < 300 && activeCard === id) {
      clearTimeout(tapTimeout);
      setFlippedCards((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } else {
      setLastTap(now);
      setTapTimeout(
        setTimeout(() => {
          if (activeCard === id) {
            if (flippedCards[id] && backHref) {
              window.open(backHref, "_blank", "noopener,noreferrer");
            } else if (!flippedCards[id] && frontHref) {
              window.open(frontHref, "_blank", "noopener,noreferrer");
            }
          } else {
            setActiveCard(id);
            setFlippedCards((prev) => ({ ...prev, [id]: false }));
          }
        }, 300)
      );
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (!isMobile) {
        if (event.key === "Escape") {
          setActiveCard(null);
          setFlippedCards({});
        } else if (event.key === " " && activeCard !== null) {
          event.preventDefault();
          setFlippedCards((prev) => ({
            ...prev,
            [activeCard]: !prev[activeCard],
          }));
        }
      }
    },
    [activeCard, isMobile]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (
        isMobile &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveCard(null);
        setFlippedCards({});
      }
    },
    [isMobile]
  );

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("keydown", handleKeyDown);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    };
  }, [handleKeyDown, handleClickOutside, isMobile]);

  const visibleCards = cards
    .slice(currentIndex, currentIndex + visibleCardsCount)
    .concat(
      cards.slice(
        0,
        Math.max(0, currentIndex + visibleCardsCount - cards.length)
      )
    );


  return (
    <Flex
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      position="relative"
      className="borderAll"
      direction="row"
      align="center"
      justify="center"
      wrap="nowrap"
      width="84%"
      height="100%"
      mx="auto"
      mt={{ base: 14, md: "10" }}
      mb={{ base: 24, md: "24" }}
      gap={{ base: 2, md: 2 }}
      style={{
        transition: isDragging
          ? "none"
          : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        cursor: isDragging ? "grabbing" : "grab",
        perspective: "1000px",
        transformStyle: "preserve-3d",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* LEFT ARROW */}
      <IconButton
        icon={<ArrowBackIcon />}
        position="absolute"
        left="2"
        top="50%"
        zIndex={10}
        onClick={handlePrev}
        aria-label="Previous Slide"
        {...arrowStyles}
      />
      {visibleCards.map((card, index) => (
        <Tooltip
          key={`${card.id}-${activeCard}`}
          label={tooltipText}
          fontWeight="bold"
          fontSize={{ base: "8px", md: "12px" }}
          isOpen={activeCard === card.id}
          placement="top"
          hasArrow
          bg="rgba(15, 23, 42, 0.85)"
          color="#00e0ff"
          border="1px solid #00e0ff"
          borderRadius="md"
          boxShadow="0 0 12px rgba(0, 224, 255, 0.6)"
          backdropFilter="blur(4px)"
          sx={{
            animation:
              activeCard === card.id
                ? `${shakeAnimation} 4s infinite`
                : undefined,
          }}
        >
          <Box
            className="borderRed"
            onClick={() => handleTap(card.id, card.frontHref, card.backHref)}
            position="relative"
            width={
              activeCard === card.id
                ? { base: "80%", md: "50%" }
                : { base: "20%", md: "16%" }
            }
            height={{ base: "300px", md: "400px" }}
            cursor="pointer"
            sx={{
              transform: flippedCards[card.id]
                ? "rotateY(180deg)"
                : `translateZ(${activeCard === card.id ? "20px" : "0px"})`,
              transformStyle: "preserve-3d",
              transition: isDragging ? "none" : "transform 1s, width 0.3s",
              filter: `brightness(${
                activeCard === card.id ? "1.1" : "0.9"
              }) contrast(${activeCard === card.id ? "1.1" : "1"})`,
            }}
          >
            {/* FRONT SIDE */}
            <Box
              position="absolute"
              width="100%"
              height="100%"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <Image
                borderRadius={6}
                src={card.frontImage}
                alt={card.title}
                width="100%"
                height="100%"
                objectFit="cover"
                draggable={false}
              />
            </Box>

            {/* BACK SIDE */}
            <Box
              position="absolute"
              width="100%"
              height="100%"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Image
                borderRadius={6}
                src={card.backImage}
                alt={`${card.title} - Back`}
                width="100%"
                height="100%"
                objectFit="cover"
                draggable={false}
              />
            </Box>
          </Box>
        </Tooltip>
      ))}
      {/* RIGHT ARROW */}
      <IconButton
        icon={<ArrowForwardIcon />}
        position="absolute"
        right="2"
        top="50%"
        zIndex={10}
        onClick={handleNext}
        aria-label="Next Slide"
        {...arrowStyles}
      />
    </Flex>
  );
}
