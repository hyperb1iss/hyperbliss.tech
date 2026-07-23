import { styled } from '../../../styled-system/jsx'

const CatSignal = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  margin: var(--space-1) 0;
  padding: var(--space-3) var(--space-4);
  color: var(--silk-plasma-pink);
  background: linear-gradient(135deg, rgba(162, 89, 255, 0.12), rgba(0, 255, 240, 0.06));
  border: 1px solid rgba(255, 117, 216, 0.35);
  border-radius: var(--radius-md);
  box-shadow: 0 0 22px rgba(255, 117, 216, 0.14);
  animation: cosmicCatSignal 2.4s ease-in-out infinite;

  @keyframes cosmicCatSignal {
    0%, 100% {
      border-color: rgba(255, 117, 216, 0.35);
      text-shadow: 0 0 7px rgba(255, 117, 216, 0.45);
    }
    50% {
      border-color: rgba(0, 255, 240, 0.5);
      text-shadow: 0 0 12px rgba(0, 255, 240, 0.7);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Cat = styled.pre`
  margin: 0;
  font-family: var(--font-mono);
  font-size: clamp(0.9rem, 4vw, 1.05rem);
  line-height: 1.15;
  text-align: center;
  white-space: pre;
`

const Message = styled.span`
  margin-top: var(--space-2);
  color: var(--silk-circuit-cyan);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  text-align: center;
`

export default function CosmicCat() {
  return (
    <CatSignal aria-label="A neon cosmic cat answers your signal" role="img">
      <Cat aria-hidden="true">{'  ✦  /\\_/\\  ✦\n    ( o.o )\n     > ^ <'}</Cat>
      <Message aria-hidden="true">mrrp protocol accepted · you found the cosmic cat</Message>
    </CatSignal>
  )
}
