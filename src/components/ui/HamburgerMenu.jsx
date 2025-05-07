"use client";

import React from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function HamburgerMenu() {
  const router = useRouter();

  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        colorScheme="purple"
      />
      <MenuList>
        {menuOptions.map((option) => (
          <MenuItem key={option.path} onClick={() => router.push(option.path)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
