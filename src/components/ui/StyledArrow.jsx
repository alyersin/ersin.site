import React from "react";
import styled from "styled-components";

const StyledArrow = ({ onClick, label = "Scroll", direction = "down" }) => {
  const isUp = direction === "up";

  return (
    <Wrapper onClick={onClick}>
      <button className="glow-button">
        <svg viewBox="0 0 384 512" className="svgIcon">
          <path
            d={
              isUp
                ? "M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                : "M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v306.8L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
            }
          />
        </svg>
        <span className="label">{label}</span>
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .glow-button {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(145deg, #7f00ff, #e100ff);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    box-shadow: 0 0 10px #a855f7, 0 0 20px #9333ea, 0 0 30px #6b21a8;
    transition: all 0.3s ease-in-out;
  }

  .glow-button:hover {
    width: 140px;
    border-radius: 50px;
    background: #0f172a;
    box-shadow: 0 0 15px #00e0ff, 0 0 30px #00c3ff;
  }

  .svgIcon {
    width: 14px;
    height: 14px;
    transition: transform 0.3s;
  }

  .svgIcon path {
    fill: #fff;
  }

  .glow-button:hover .svgIcon {
    transform: translateY(150%);
    opacity: 0;
    visibility: hidden;
  }

  .label {
    position: absolute;
    font-size: 0px;
    color: #00e0ff;
    bottom: -20px;
    transition: all 0.3s ease-in-out;
  }

  .glow-button:hover .label {
    font-size: 14px;
    bottom: unset;
  }
`;

export default StyledArrow;
