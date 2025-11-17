import React from "react";
import styled from "styled-components";

// GLOWING BUTTON WITH ICON SUPPORT
export default function StyledBtn_3({ text = "Button", onClick, icon }) {
  return (
    <StyledWrapper>
      <button className="glowbutton" onClick={onClick}>
        {text} {icon}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    --glow-color: rgb(217, 176, 255);
    --glow-spread-color: rgba(191, 123, 255, 0.781);
    --enhanced-glow-color: rgb(231, 206, 255);
    --btn-color: rgb(100, 61, 136);
    border: 0.25em solid var(--glow-color);
    padding: 0.8em 2em;
    color: var(--glow-color);
    font-size: 1rem;
    font-weight: bold;
    background-color: var(--btn-color);
    border-radius: 1em;
    outline: none;
    box-shadow: 0 0 1em 0.25em var(--glow-color),
      0 0 4em 1em var(--glow-spread-color),
      inset 0 0 0.75em 0.25em var(--glow-color);
    text-shadow: 0 0 0.5em var(--glow-color);
    position: relative;
    transition: all 0.3s;
    white-space: nowrap;
    max-width: 90vw;
    width: fit-content;
  }

  button::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 120%;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(2em);
    opacity: 0.7;
    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
  }

  button:hover {
    color: var(--btn-color);
    background-color: var(--glow-color);
    box-shadow: 0 0 1em 0.25em var(--glow-color),
      0 0 4em 2em var(--glow-spread-color),
      inset 0 0 0.75em 0.25em var(--glow-color);
  }

  button:active {
    box-shadow: 0 0 0.6em 0.25em var(--glow-color),
      0 0 2.5em 2em var(--glow-spread-color),
      inset 0 0 0.5em 0.25em var(--glow-color);
  }

  @media (max-width: 768px) {
    button {
      padding: 0.6em 1.4em;
      font-size: 0.95rem;
    }
  }

  @media (max-width: 480px) {
    button {
      padding: 0.5em 1em;
      font-size: 0.9rem;
    }
  }
`;
