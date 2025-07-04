import Image from "next/image";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function StyledHamburger({ onContactClick, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const [techStackActive, setTechStackActive] = useState(false);
  const [activeSubTech, setActiveSubTech] = useState(null);
  const [activeTechImage, setActiveTechImage] = useState(null);

  const subTechImages = [
    // Frontend
    [
      { src: "/assets/techstack/htmlcssjs.webp", alt: "HTML/CSS/JS" },
      { src: "/assets/techstack/react.png", alt: "React" },
      { src: "/assets/techstack/nextjs.png", alt: "NextJS" },
      { src: "/assets/techstack/chakra.png", alt: "chakra" },
      { src: "/assets/techstack/git.png", alt: "GIT" },
      { src: "/assets/techstack/rest.png", alt: "RESTapi" },
    ],
    // Backend
    [
      { src: "/assets/techstack/nodejs.png", alt: "Node.js" },
      { src: "/assets/techstack/expressjs.png", alt: "Express" },
      { src: "/assets/techstack/backend.png", alt: "REST API" },
      { src: "/assets/techstack/backend.png", alt: "GraphQL" },
      { src: "/assets/techstack/backend.png", alt: "Socket.io" },
      { src: "/assets/techstack/backend.png", alt: "JWT" },
    ],
    // Database
    [
      { src: "/assets/techstack/firebase.png", alt: "Firebase" },
      { src: "/assets/techstack/postgresql1.png", alt: "PostgreSQL" },
      { src: "/assets/techstack/mysql.png", alt: "MySQL" },
      { src: "/assets/techstack/database.png", alt: "Redis" },
      { src: "/assets/techstack/database.png", alt: "Prisma" },
      { src: "/assets/techstack/database.png", alt: "Mongoose" },
    ],
    // Server
    [
      { src: "/assets/techstack/docker.png", alt: "Docker" },
      { src: "/assets/techstack/nginx.png", alt: "Nginx" },
      { src: "/assets/techstack/sysadmin.png", alt: "Sysadmin" },
      { src: "/assets/techstack/githubactions.png", alt: "GitGub Actions" },
      { src: "/assets/techstack/azure.png", alt: "Azure" },
      { src: "/assets/techstack/server.png", alt: "Vercel" },
    ],
  ];

  const handleToggle = () => {
    if (activeSubTech !== null) {
      setActiveSubTech(null);
    } else if (techStackActive) {
      setTechStackActive(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleTechStackClick = (e) => {
    e.preventDefault();
    setTechStackActive(true);
  };

  const handleSubTechClick = (idx, img) => (e) => {
    e.preventDefault();
    setActiveSubTech(idx);
    setActiveTechImage(img);
  };

  const handleSubTechCenterClick = (e) => {
    e.preventDefault();
    setActiveSubTech(null);
    setActiveTechImage(null);
  };

  const handleContactClick = () => {
    onContactClick();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!(isOpen || techStackActive || activeSubTech !== null)) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (activeSubTech !== null) {
          setActiveSubTech(null);
          setActiveTechImage(null);
        } else if (techStackActive) {
          setTechStackActive(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, techStackActive, activeSubTech]);

  return (
    <StyledWrapper
      className={
        isOpen || techStackActive || activeSubTech !== null ? "open" : ""
      }
    >
      <nav className="menu">
        <input
          type="checkbox"
          id="menu-open"
          className="menu-open"
          checked={isOpen || techStackActive || activeSubTech !== null}
          onChange={handleToggle}
        />
        <label className="menu-open-button" htmlFor="menu-open">
          <span className="lines line-1" />
          <span className="lines line-2" />
          <span className="lines line-3" />
        </label>
        {activeSubTech !== null ? (
          <>
            <a
              href="#"
              className="menu-item techstack-center"
              style={{ zIndex: 3 }}
              onClick={handleSubTechCenterClick}
            >
              {activeTechImage ? (
                <Image
                  src={activeTechImage.src}
                  alt={activeTechImage.alt}
                  width={50}
                  height={50}
                  style={{
                    objectFit: "contain",
                    maxWidth: "80%",
                    maxHeight: "80%",
                  }}
                />
              ) : (
                <span className="item-label">Icon {activeSubTech + 1}</span>
              )}
            </a>
            {(subTechImages[activeSubTech] || []).map((img, idx) => (
              <div
                key={idx}
                className={`subtech-circle subtech-circle-${idx + 1}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={70}
                  height={70}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ))}
          </>
        ) : techStackActive ? (
          <>
            <a
              href="#"
              className="menu-item techstack-center"
              style={{ zIndex: 3 }}
              onClick={(e) => {
                e.preventDefault();
                setTechStackActive(false);
              }}
            >
              <span className="item-label">Tech stack</span>
            </a>
            {[
              { src: "/assets/techstack/frontend.png", alt: "React" },
              { src: "/assets/techstack/backend.png", alt: "Node.js" },
              { src: "/assets/techstack/database.png", alt: "Next.js" },
              { src: "/assets/techstack/server.png", alt: "Bootstrap" },
            ].map((img, idx) => (
              <div
                key={idx}
                className={`techstack-circle techstack-circle-${idx + 1}`}
                onClick={handleSubTechClick(idx, img)}
                style={{ cursor: "pointer" }}
              >
                <Image src={img.src} alt={img.alt} width={70} height={32} />
                {/* <span className="techstack-icon">{img.alt}</span> */}
              </div>
            ))}
          </>
        ) : (
          <>
            <a href="#" className="menu-item blue" rel="noopener noreferrer">
              <i className="fa fa-anchor" />
              <span className="item-label">Blog</span>
            </a>
            <a
              href="#"
              className="menu-item green"
              rel="noopener noreferrer"
              onClick={handleTechStackClick}
            >
              <i className="fa fa-coffee" />
              <span className="item-label">Tech stack</span>
            </a>
            <a
              href="#"
              className="menu-item red"
              onClick={(e) => {
                e.preventDefault();
                closeMenu?.();
                onContactClick?.();
              }}
            >
              <i className="fa fa-heart" />
              <span className="item-label">Contact</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ersin-ali-228301107/"
              className="menu-item purple"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-microphone" />
              <span className="item-label">LinkedIn</span>
            </a>
            <a
              href="https://github.com/alyersin"
              className="menu-item orange"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-star" />
              <span className="item-label">GitHub</span>
            </a>
            <a
              href="https://www.facebook.com/aly.ersin"
              className="menu-item lightblue"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-diamond" />
              <span className="item-label">Facebook</span>
            </a>
          </>
        )}
      </nav>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  &:not(.open) .menu-item {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }

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

  .menu-item {
    background: radial-gradient(
      circle,
      rgba(100, 61, 136, 0.8),
      rgba(0, 0, 0, 0.8)
    );
    border: 1px solid rgba(217, 176, 255, 0.3);
    box-shadow: 0 0 15px rgba(217, 176, 255, 0.5),
      0 0 30px rgba(191, 123, 255, 0.3), inset 0 0 10px rgba(217, 176, 255, 0.4);
    color: white;
    text-shadow: 0 0 5px rgba(217, 176, 255, 0.8);
    font-weight: bold;
    font-size: 12px;
    transition: all 0.3s ease;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4),
      0 0 25px rgba(217, 176, 255, 0.5);
    color: #fff;
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

  .techstack-center {
    position: absolute;
    top: 130%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #70cc72;
    z-index: 4;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    box-shadow: 0 0 30px rgba(100, 255, 100, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: normal;
    overflow: hidden;
  }
  .techstack-circle {
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: #fff;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(100, 255, 100, 0.2);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 2;
    top: 50%;
    left: 50%;
  }
  .techstack-icon {
    /* Placeholder for icon */
    font-size: 13px;
    text-align: center;
    width: 100%;
  }
  /* Position 4 circles around the center using polar coordinates */
  .techstack-circle-1 {
    transform: translate(-50%, -50%) rotate(0deg) translate(90px) rotate(0deg);
  }
  .techstack-circle-2 {
    transform: translate(-50%, -50%) rotate(90deg) translate(90px)
      rotate(-90deg);
  }
  .techstack-circle-3 {
    transform: translate(-50%, -50%) rotate(180deg) translate(90px)
      rotate(-180deg);
  }
  .techstack-circle-4 {
    transform: translate(-50%, -50%) rotate(270deg) translate(90px)
      rotate(-270deg);
  }

  /* Subtech circles (6 around the center) */
  .subtech-circle {
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    // background: #fff;
    background: transparent;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    box-shadow: 0 0 8px rgba(100, 255, 100, 0.15);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 2;
    top: 50%;
    left: 50%;
  }
  .subtech-circle-1 {
    transform: translate(-50%, -50%) rotate(0deg) translate(90px) rotate(0deg);
  }
  .subtech-circle-2 {
    transform: translate(-50%, -50%) rotate(60deg) translate(90px)
      rotate(-60deg);
  }
  .subtech-circle-3 {
    transform: translate(-50%, -50%) rotate(120deg) translate(90px)
      rotate(-120deg);
  }
  .subtech-circle-4 {
    transform: translate(-50%, -50%) rotate(180deg) translate(90px)
      rotate(-180deg);
  }
  .subtech-circle-5 {
    transform: translate(-50%, -50%) rotate(240deg) translate(90px)
      rotate(-240deg);
  }
  .subtech-circle-6 {
    transform: translate(-50%, -50%) rotate(300deg) translate(90px)
      rotate(-300deg);
  }
`;
