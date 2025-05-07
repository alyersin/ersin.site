"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import ConnectingDots from "../components/ui/Effects/ConnectingDots";
import { ChevronDownIcon } from "@chakra-ui/icons";
import StyledBtn_3 from "@/components/ui/StyledBtn_3";
import { useRef } from "react";
import MonitorToggle from "@/components/ui/MonitorToggle";

export default function Home() {
  const homeRef = useRef(null);
  const workRef = useRef(null);

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: "smooth", inline: "start" });
  };

  const scrollToHome = () => {
    homeRef.current?.scrollIntoView({ behavior: "smooth", inline: "start" });
  };

  return (
    <Box
      display="flex"
      width="200vw"
      height="100vh"
      overflowX="auto"
      scrollBehavior="smooth"
    >
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
            icon={<ChevronDownIcon />}
          />
        </VStack>
      </Box>

      {/* WORK SECTION */}
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
    </Box>
  );
}
