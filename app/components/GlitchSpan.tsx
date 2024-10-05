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
  }

  &::before {
    left: 2px;
    text-shadow: -2px 0 #00ffff;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -2px 0 #ff00ff;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 7s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim {
    0% {
      clip: rect(31px, 9999px, 94px, 0);
    }
    10% {
      clip: rect(70px, 9999px, 71px, 0);
    }
    20% {
      clip: rect(29px, 9999px, 83px, 0);
    }
    30% {
      clip: rect(38px, 9999px, 92px, 0);
    }
    40% {
      clip: rect(89px, 9999px, 23px, 0);
    }
    50% {
      clip: rect(54px, 9999px, 81px, 0);
    }
    60% {
      clip: rect(69px, 9999px, 43px, 0);
    }
    70% {
      clip: rect(98px, 9999px, 12px, 0);
    }
    80% {
      clip: rect(26px, 9999px, 91px, 0);
    }
    90% {
      clip: rect(84px, 9999px, 37px, 0);
    }
    100% {
      clip: rect(67px, 9999px, 62px, 0);
    }
  }
`;

export default GlitchSpan;