"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import ConnectingDots from "../components/ui/Effects/ConnectingDots";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import StyledBtn_3 from "@/components/ui/StyledBtn_3";
import MonitorToggle from "@/components/ui/MonitorToggle";
import StyledHamburger from "@/components/ui/StyledHamburger";
import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import StyledForm_2 from "@/components/ui/StyledForm_2";

export default function Home() {
  const homeRef = useRef(null);
  const workRef = useRef(null);
  const mobileWorkRef = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 968px)");
    setIsLargeScreen(mediaQuery.matches);
    const handler = (e) => setIsLargeScreen(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const openModalAndCloseMenu = () => {
    setIsMenuOpen(false);
    onOpen();
  };

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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StyledForm_2 />
        </ModalContent>
      </Modal>

      <Box
        display="flex"
        flexDirection={isLargeScreen ? "row" : "column"}
        width={isLargeScreen ? "200vw" : "100vw"}
        height="100%"
      >
        <Box
          position="fixed"
          top={["4rem", "2rem", "4rem"]}
          left={["10%", "50%", "2rem"]}
          transform={["translateX(-50%)", "translateX(-50%)", "none"]}
          zIndex="1000"
        >
          <StyledHamburger
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onContactClick={openModalAndCloseMenu}
          />
        </Box>

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

      {!isLargeScreen && (
        <Box
          height="6px"
          width="100%"
          bgGradient="linear(to-r, #6b46c1, #b83280)"
          opacity={0.4}
        />
      )}

      {!isLargeScreen && (
        <Box
          ref={mobileWorkRef}
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          px={8}
          pt={4}
          pb={8}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="whiteAlpha.200"
            borderRadius="md"
            px={4}
            py={2}
            width="fit-content"
            mx="auto"
          >
            <Box
              as={require("@chakra-ui/icons").InfoOutlineIcon}
              color="purple.200"
              // boxSize={5}
              mr={2}
            />
            <Text color="purple.100" fontStyle="italic" fontSize="xs">
              Best viewed on desktop
            </Text>
          </Box>
          <VStack spacing={8} position="relative" zIndex={2} width="100%">
            <SimpleGrid columns={[1, 2, 3]} spacing={6} p={8}>
              <Card
                title="E-Commerce app PRODUCTION BUILD"
                image="/assets/projects/coffee-shop01.avif"
                link="https://cafe-prestigeapp-git-main-alyersins-projects.vercel.app/"
                buttonText="Live Site"
                bg="purple.700"
                shadow="lg"
              />
              <Card
                title="URBAN-EDGE - DESIGN ONLY"
                image="/assets/projects/urban-edge.avif"
                link="https://urban-edge-rho.vercel.app/"
                buttonText="Preview"
                bg="gray.800"
              />
              <Card
                title="SAO-MARCO-PIZZA - DESIGN ONLY"
                image="/assets/projects/sao-marco-pizza.avif"
                link="https://sao-marco-pizza.vercel.app/"
                buttonText="See Live"
                bg="red.600"
              />
              <Card
                title="MCS-Workload platform"
                image="/assets/projects/mcs-workload.png"
                link="https://mcs-workload.vercel.app/"
                buttonText="Visit"
                bg="teal.700"
              />
              <Card
                title="CAREER-SKETCH - DESIGN ONLY"
                image="/assets/projects/career-sketch.avif"
                link="https://career-sketch.vercel.app/"
                buttonText="Open"
                bg="blue.600"
              />
            </SimpleGrid>

            {/* <StyledForm_2 /> */}
          </VStack>
        </Box>
      )}
    </Box>
  );
}
