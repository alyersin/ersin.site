// components/ui/Card.jsx
"use client";

import { Box, Image, Heading, Text, Button, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";

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
}) {
  return (
    <Box
      as={motion.div}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      borderRadius="xl"
      overflow="hidden"
      bg={bg}
      color={color}
      border={border}
      boxShadow={shadow}
      maxW="sm"
      w="full"
      p={4}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          borderRadius="md"
          objectFit="cover"
          mb={4}
        />
      )}

      <Heading size="md" mb={2}>
        {title}
      </Heading>

      <Text fontSize="sm" mb={4}>
        {description}
      </Text>

      {link && (
        <Link href={link} isExternal>
          <Button colorScheme="teal" size="sm">
            {buttonText}
          </Button>
        </Link>
      )}
    </Box>
  );
}
