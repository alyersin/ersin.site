// components/ui/Card.jsx
"use client";

import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function Card({
  image,
  title,
  description,
  link,
  buttonText = "Learn More",
  bg = "gray.800",
  color = "white",
  border = "1px solid #444",
  shadow = "lg",
  category,
}) {
  const getCategoryColor = (title) => {
    if (title.includes("PRODUCTION")) return "green";
    if (title.includes("DESIGN ONLY")) return "orange";
    if (
      title.includes("Kinder Garten") ||
      title.includes("Mini-Scoala") ||
      title.includes("MCS-Workload")
    )
      return "green";
    return "blue";
  };

  const categoryColor = getCategoryColor(title);

  return (
    <Box
      as={motion.div}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      borderRadius="2xl"
      overflow="hidden"
      bg={`linear-gradient(135deg, ${bg}, ${bg}dd)`}
      color={color}
      border="none"
      boxShadow={`${shadow}, 0 0 20px rgba(0,0,0,0.3)`}
      maxW="sm"
      w="full"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* Category Badge */}
      <Flex
        justify="space-between"
        align="flex-start"
        p={4}
        pb={2}
        position="relative"
        zIndex={2}
      >
        <Badge
          colorScheme={categoryColor}
          variant="subtle"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {title.includes("PRODUCTION")
            ? "Live"
            : title.includes("DESIGN")
            ? "Design"
            : title.includes("Kinder Garten") ||
              title.includes("Mini-Scoala") ||
              title.includes("MCS-Workload")
            ? "Live"
            : "Project"}
        </Badge>
      </Flex>

      {/* Image Container */}
      {image && (
        <Box
          position="relative"
          mx={4}
          mb={4}
          borderRadius="xl"
          overflow="hidden"
        >
          <Image
            src={image}
            alt={title}
            width="100%"
            height="200px"
            objectFit="cover"
            transition="transform 0.3s ease"
            _groupHover={{ transform: "scale(1.05)" }}
          />
          {/* Image Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))"
            opacity={0}
            transition="opacity 0.3s ease"
            _groupHover={{ opacity: 1 }}
          />
        </Box>
      )}

      {/* Content */}
      <Box px={4} pb={4} position="relative" zIndex={2}>
        <Heading
          size="md"
          mb={3}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          lineHeight="shorter"
          textShadow="0 1px 2px rgba(0,0,0,0.3)"
        >
          {title}
        </Heading>

        {description && (
          <Text
            fontSize="sm"
            mb={4}
            color="gray.200"
            lineHeight="1.5"
            opacity={0.9}
          >
            {description}
          </Text>
        )}

        {/* Button */}
        {link && (
          <Link href={link} isExternal>
            <Button
              colorScheme="teal"
              size="sm"
              borderRadius="full"
              px={6}
              py={2}
              fontSize="sm"
              fontWeight="semibold"
              bg="rgba(56, 178, 172, 0.9)"
              color="white"
              border="1px solid rgba(56, 178, 172, 0.3)"
              backdropFilter="blur(10px)"
              _hover={{
                bg: "teal.500",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(56, 178, 172, 0.4)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s ease"
              rightIcon={<ExternalLinkIcon boxSize={3} />}
              width="full"
            >
              {buttonText}
            </Button>
          </Link>
        )}
      </Box>

      {/* Subtle border glow */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        borderRadius="2xl"
        border="1px solid rgba(255,255,255,0.1)"
        pointerEvents="none"
      />
    </Box>
  );
}
