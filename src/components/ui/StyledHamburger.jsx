import React, { useState } from "react";
import styled from "styled-components";

export default function StyledHamburger() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledWrapper className={isOpen ? "open" : ""}>
      <nav className="menu">
        <input
          type="checkbox"
          id="menu-open"
          className="menu-open"
          checked={isOpen}
          onChange={handleToggle}
        />
        <label className="menu-open-button" htmlFor="menu-open">
          <span className="lines line-1" />
          <span className="lines line-2" />
          <span className="lines line-3" />
        </label>

        {/* Menu items */}
        <a href="#" className="menu-item blue">
          <i className="fa fa-anchor" />
          <span className="item-label">Anchor</span>
        </a>
        <a href="#" className="menu-item green">
          <i className="fa fa-coffee" />
          <span className="item-label">Coffee</span>
        </a>
        <a href="#" className="menu-item red">
          <i className="fa fa-heart" />
          <span className="item-label">Love</span>
        </a>
        <a href="#" className="menu-item purple">
          <i className="fa fa-microphone" />
          <span className="item-label">Mic</span>
        </a>
        <a href="#" className="menu-item orange">
          <i className="fa fa-star" />
          <span className="item-label">Star</span>
        </a>
        <a href="#" className="menu-item lightblue">
          <i className="fa fa-diamond" />
          <span className="item-label">Gem</span>
        </a>
      </nav>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .menu {
    position: absolute;
    top: 6rem;
    left: 4rem;
    width: 80px;
    height: 80px;
    margin: auto;
    text-align: center;
    font-size: 26px;
    transition: top 0.5s ease, left 0.5s ease;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    backdrop-filter: blur(6px);
    box-shadow: 0 0 20px rgba(180, 100, 255, 0.3);
  }

  &.open .menu {
    top: 8rem;
    left: 8rem;
  }

  .menu-item,
  .menu-open-button {
    background: #eeeeee;
    border-radius: 100%;
    width: 80px;
    height: 80px;
    margin-left: -40px;
    margin-top: 0px;
    position: absolute;
    color: #ffffff;
    text-align: center;
    line-height: 80px;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-transition: -webkit-transform ease-out 200ms;
    transition: -webkit-transform ease-out 200ms;
    transition: transform ease-out 200ms;
  }

  .menu-open-button {
    background: radial-gradient(
      circle,
      rgba(100, 61, 136, 0.6),
      rgba(0, 0, 0, 0.9)
    );
    border: 1px solid rgba(217, 176, 255, 0.4);
    box-shadow: 0 0 10px rgba(217, 176, 255, 0.5);
  }

  .menu-item {
    background: rgba(100, 61, 136, 0.8);
    border: 1px solid rgba(217, 176, 255, 0.3);
    box-shadow: 0 0 10px rgba(217, 176, 255, 0.6);

    // display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    text-align: center;
    transition: transform 0.3s ease;
  }

  .menu-open {
    display: none;
  }

  .lines {
    width: 25px;
    height: 3px;
    background: #596778;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -12.5px;
    margin-top: -1.5px;
    -webkit-transition: -webkit-transform 200ms;
    transition: -webkit-transform 200ms;
    transition: transform 200ms;
  }

  .line-1 {
    -webkit-transform: translate3d(0, -8px, 0);
    transform: translate3d(0, -8px, 0);
  }

  .line-2 {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  .line-3 {
    -webkit-transform: translate3d(0, 8px, 0);
    transform: translate3d(0, 8px, 0);
  }

  .menu-open:checked + .menu-open-button .line-1 {
    -webkit-transform: translate3d(0, 0, 0) rotate(45deg);
    transform: translate3d(0, 0, 0) rotate(45deg);
  }

  .menu-open:checked + .menu-open-button .line-2 {
    -webkit-transform: translate3d(0, 0, 0) scale(0.1, 1);
    transform: translate3d(0, 0, 0) scale(0.1, 1);
  }

  .menu-open:checked + .menu-open-button .line-3 {
    -webkit-transform: translate3d(0, 0, 0) rotate(-45deg);
    transform: translate3d(0, 0, 0) rotate(-45deg);
  }

  .menu {
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 80px;
    height: 80px;
    text-align: center;
    box-sizing: border-box;
    font-size: 26px;
  }

  /* .menu-item {
     transition: all 0.1s ease 0s;
  } */

  .menu-item:hover {
    background: #eeeeee;
    color: #3290b1;
  }

  .menu-item:nth-child(3) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-item:nth-child(4) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-item:nth-child(5) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-item:nth-child(6) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-item:nth-child(7) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-item:nth-child(8) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-item:nth-child(9) {
    -webkit-transition-duration: 180ms;
    transition-duration: 180ms;
  }

  .menu-open-button {
    z-index: 2;
    -webkit-transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -webkit-transition-duration: 400ms;
    transition-duration: 400ms;
    -webkit-transform: scale(1.1, 1.1) translate3d(0, 0, 0);
    transform: scale(1.1, 1.1) translate3d(0, 0, 0);
    cursor: pointer;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
  }

  .menu-open-button:hover {
    -webkit-transform: scale(1.2, 1.2) translate3d(0, 0, 0);
    transform: scale(1.2, 1.2) translate3d(0, 0, 0);
  }

  .menu-open:checked + .menu-open-button {
    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
    -webkit-transform: scale(0.8, 0.8) translate3d(0, 0, 0);
    transform: scale(0.8, 0.8) translate3d(0, 0, 0);
  }

  .menu-open:checked ~ .menu-item {
    -webkit-transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
    transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
  }

  .menu-open:checked ~ .menu-item:nth-child(3) {
    transition-duration: 180ms;
    -webkit-transition-duration: 180ms;
    -webkit-transform: translate3d(0.08361px, -104.99997px, 0);
    transform: translate3d(0.08361px, -104.99997px, 0);
  }

  .menu-open:checked ~ .menu-item:nth-child(4) {
    transition-duration: 280ms;
    -webkit-transition-duration: 280ms;
    -webkit-transform: translate3d(90.9466px, -52.47586px, 0);
    transform: translate3d(90.9466px, -52.47586px, 0);
  }

  .menu-open:checked ~ .menu-item:nth-child(5) {
    transition-duration: 380ms;
    -webkit-transition-duration: 380ms;
    -webkit-transform: translate3d(90.9466px, 52.47586px, 0);
    transform: translate3d(90.9466px, 52.47586px, 0);
  }

  .menu-open:checked ~ .menu-item:nth-child(6) {
    transition-duration: 480ms;
    -webkit-transition-duration: 480ms;
    -webkit-transform: translate3d(0.08361px, 104.99997px, 0);
    transform: translate3d(0.08361px, 104.99997px, 0);
  }

  .menu-open:checked ~ .menu-item:nth-child(7) {
    transition-duration: 580ms;
    -webkit-transition-duration: 580ms;
    -webkit-transform: translate3d(-90.86291px, 52.62064px, 0);
    transform: translate3d(-90.86291px, 52.62064px, 0);
  }

  .menu-open:checked ~ .menu-item:nth-child(8) {
    transition-duration: 680ms;
    -webkit-transition-duration: 680ms;
    -webkit-transform: translate3d(-91.03006px, -52.33095px, 0);
    transform: translate3d(-91.03006px, -52.33095px, 0);
  }

  .menu-open:checked ~ .menu-item:nth-child(9) {
    transition-duration: 780ms;
    -webkit-transition-duration: 780ms;
    -webkit-transform: translate3d(-0.25084px, -104.9997px, 0);
    transform: translate3d(-0.25084px, -104.9997px, 0);
  }

  .blue {
    background-color: #669ae1;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
  }

  .blue:hover {
    color: #669ae1;
    text-shadow: none;
  }

  .green {
    background-color: #70cc72;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
  }

  .green:hover {
    color: #70cc72;
    text-shadow: none;
  }

  .red {
    background-color: #fe4365;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
  }

  .red:hover {
    color: #fe4365;
    text-shadow: none;
  }

  .purple {
    background-color: #c49cde;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
  }

  .purple:hover {
    color: #c49cde;
    text-shadow: none;
  }

  .orange {
    background-color: #fc913a;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
  }

  .orange:hover {
    color: #fc913a;
    text-shadow: none;
  }

  .lightblue {
    background-color: #62c2e4;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
  }

  .lightblue:hover {
    color: #62c2e4;
    text-shadow: none;
  }

  .credit {
    margin: 24px 20px 120px 0;
    text-align: right;
    color: #eeeeee;
  }

  .credit a {
    padding: 8px 0;
    color: #c49cde;
    text-decoration: none;
    transition: all 0.3s ease 0s;
  }

  .credit a:hover {
    text-decoration: underline;
  }
`;
