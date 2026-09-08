import { styled } from '../../styled-system/jsx'

const GlitchSpan = styled.span`
  display: inline-block;
  position: relative;
  color: #fff;
  text-shadow:
    2px 2px #ff00ff,
    -2px -2px #00ffff;

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
    animation: silkGlitchPrimary 2s infinite linear alternate-reverse;
  }

  &::after {
    left: -1px;
    text-shadow: -1px 0 #ff00ff;
    animation: silkGlitchSecondary 2s infinite linear alternate-reverse;
  }

`

export default GlitchSpan
