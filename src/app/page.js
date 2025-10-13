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
          px={4}
          pt={6}
          pb={12}
          minHeight="100vh"
        >
          {/* Info Banner */}
          <Box mb={6} textAlign="center">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              borderRadius="full"
              px={4}
              py={2}
              width="fit-content"
              mx="auto"
              border="1px solid rgba(255, 255, 255, 0.2)"
            >
              <Box
                as={require("@chakra-ui/icons").InfoOutlineIcon}
                color="purple.200"
                boxSize={4}
                mr={2}
              />
              <Text color="purple.100" fontStyle="italic" fontSize="xs">
                Best viewed on desktop
              </Text>
            </Box>
          </Box>
          <VStack
            spacing={6}
            position="relative"
            zIndex={2}
            width="100%"
            px={4}
          >
            <SimpleGrid columns={[1, 1, 2]} spacing={4} w="full" maxW="600px">
              <Card
                title="E-Commerce app PRODUCTION BUILD"
                image="/assets/projects/coffee-shop01.avif"
                link="https://coffee-shop-app-xi.vercel.app/"
                buttonText="Visit"
                bg="purple.700"
                shadow="xl"
                description="Full-stack e-commerce platform with modern UI/UX"
              />
              <Card
                title="Kinder Garten Edu Games"
                image="/assets/projects/kindergarten.avif"
                link="https://kindergarten-edu-games.vercel.app/"
                buttonText="Visit"
                bg="green.600"
                shadow="xl"
                description="Educational games platform for kindergarten learning"
              />
              <Card
                title="Mini-Scoala"
                image="/assets/projects/mini-scoala.avif"
                link="http://5.14.11.22:3025/"
                buttonText="Visit"
                bg="orange.600"
                shadow="xl"
                description="Production educational platform for comprehensive school learning management"
              />
              <Card
                title="MCS-Workload platform"
                image="/assets/projects/mcs-workload.png"
                link="https://mcs-workload.vercel.app/"
                buttonText="Visit"
                bg="teal.700"
                shadow="xl"
                description="Workload management system dashboard"
              />
              <Card
                title="CAREER-SKETCH - DESIGN ONLY"
                image="/assets/projects/career.avif"
                link="https://career-sketch.vercel.app/"
                buttonText="Visit"
                bg="blue.600"
                shadow="xl"
                description="Professional portfolio and career showcase"
              />
              <Card
                title="TECH-BLOG - DESIGN ONLY"
                image="/assets/projects/techblog.avif"
                link="https://tech-blog-alpha-fawn.vercel.app/"
                buttonText="Visit"
                bg="cyan.600"
                shadow="xl"
                description="Modern tech blog with clean design interface"
              />
              <Card
                title="SAO-MARCO-PIZZA - DESIGN ONLY"
                image="/assets/projects/sao-marco-pizza.avif"
                link="https://sao-marco-pizza.vercel.app/"
                buttonText="Visit"
                bg="red.600"
                shadow="xl"
                description="Pizza ordering interface with appetizing design"
              />
            </SimpleGrid>

            {/* <StyledForm_2 /> */}
          </VStack>
        </Box>
      )}
    </Box>
  );
}
