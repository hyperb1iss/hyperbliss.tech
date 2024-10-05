import styled from "styled-components";

const GlitchSpan = styled.span`
  display: inline-block;
  position: relative;
  color: #fff;
  text-shadow: 2px 2px #ff00ff, -2px -2px #00ffff;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    clip: rect(0, 0, 0, 0);
  }

  &::before {
    left: 1px;
    text-shadow: -1px 0 #00ffff;
    animation: glitch-anim-1 2s infinite linear alternate-reverse;
  }

  &::after {
    left: -1px;
    text-shadow: -1px 0 #ff00ff;
    animation: glitch-anim-2 2s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim-1 {
    0% {
      clip: rect(10px, 9999px, 20px, 0);
    }
    50% {
      clip: rect(85px, 9999px, 90px, 0);
    }
    100% {
      clip: rect(45px, 9999px, 55px, 0);
    }
  }

  @keyframes glitch-anim-2 {
    0% {
      clip: rect(60px, 9999px, 70px, 0);
    }
    50% {
      clip: rect(25px, 9999px, 35px, 0);
    }
    100% {
      clip: rect(5px, 9999px, 15px, 0);
    }
  }
`;

export default GlitchSpan;