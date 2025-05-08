"use client";

import { Box, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import ConnectingDots from "../components/ui/Effects/ConnectingDots";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import StyledBtn_3 from "@/components/ui/StyledBtn_3";
import MonitorToggle from "@/components/ui/MonitorToggle";
import StyledHamburger from "@/components/ui/StyledHamburger";
import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import Dots from "@/components/ui/Effects/Dots";

export default function Home() {
  const homeRef = useRef(null);
  const workRef = useRef(null);
  const mobileWorkRef = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 968px)");
    setIsLargeScreen(mediaQuery.matches);
    const handler = (e) => setIsLargeScreen(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const scrollToWork = () => {
    if (isLargeScreen) {
      workRef.current?.scrollIntoView({ behavior: "smooth", inline: "start" });
    } else {
      mobileWorkRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHome = () => {
    homeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box width="100vw" height="auto" overflow="hidden" scrollBehavior="smooth">
      {/* HORIZONTAL SCROLL (ONLY ON DESKTOP) */}
      <Box
        display="flex"
        flexDirection={isLargeScreen ? "row" : "column"}
        width={isLargeScreen ? "200vw" : "100vw"}
        height="100%"
      >
        {/* Hamburger */}
        <Box position="absolute" top="4rem" left="2rem" zIndex="10">
          <StyledHamburger />
        </Box>

        {/* HOME SECTION */}
        <Box
          ref={homeRef}
          position="relative"
          width="100vw"
          height="100vh"
          flexShrink={0}
          overflow="hidden"
        >
          <ConnectingDots />
          <VStack
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            spacing={6}
            textAlign="center"
            zIndex="1"
            px={4}
          >
            <Heading fontSize={["2xl", "4xl", "5xl"]} color="white">
              Hello, I&apos;m{" "}
              <Box as="span" color="purple.300">
                Ersin
              </Box>
              .
            </Heading>

            <Text fontSize={["md", "lg", "xl"]} color="white">
              Web Developer
            </Text>

            <StyledBtn_3
              text="View my work"
              onClick={scrollToWork}
              icon={isLargeScreen ? <ChevronRightIcon /> : <ChevronDownIcon />}
            />
          </VStack>
        </Box>

        {/* DESKTOP WORK SECTION */}
        {isLargeScreen && (
          <Box
            ref={workRef}
            width="100vw"
            height="100vh"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <MonitorToggle onBack={scrollToHome} />
          </Box>
        )}
      </Box>
      {/* TRANSITION BAR */}
      {!isLargeScreen && (
        <Box
          height="6px"
          width="100%"
          bgGradient="linear(to-r, #6b46c1, #b83280)"
          opacity={0.4}
        />
      )}

      {/* MOBILE WORK SECTION */}
      {!isLargeScreen && (
        <Box
          ref={mobileWorkRef}
          width="100%"
          // minHeight="100vh"
          display="flex"
          // flexDirection="column"
          alignItems="center"
          justifyContent="center"
          // bg="gray.900"
          px={8}
          py={20}
        >
          <Dots />
          <SimpleGrid columns={[1, 2, 3]} spacing={6} p={8}>
            <Card
              title="Next.js Projects"
              description="Build blazing-fast web apps using Next.js."
              image="https://source.unsplash.com/random/300x200?nextjs"
              link="https://nextjs.org"
              buttonText="Explore"
            />
            <Card
              title="My Portfolio"
              description="Check out my personal and freelance projects."
              image="https://source.unsplash.com/random/300x200?developer"
              link="/portfolio"
              bg="purple.700"
              shadow="2xl"
            />
            <Card
              title="Contact Me"
              description="Have a project in mind? Let's talk!"
              image="https://source.unsplash.com/random/300x200?contact"
              link="/contact"
              color="black"
              bg="yellow.300"
            />
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
