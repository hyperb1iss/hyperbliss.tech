import type { FeedKind } from '@/lib/feed'
import { styled } from '../../../styled-system/jsx'
import { KIND_LABEL } from './format'

const Tag = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1;
  padding: 0.5rem 0.8rem 0.4rem;
  border: 1px solid rgba(162, 89, 255, 0.34);
  border-radius: 2px;
  color: var(--silk-quantum-purple);
  white-space: nowrap;

  &[data-kind='lab'] {
    color: var(--silk-circuit-cyan);
    border-color: rgba(0, 255, 240, 0.35);
  }
  &[data-kind='release'],
  &[data-kind='launch'] {
    color: var(--text-secondary);
    border-color: rgba(148, 163, 184, 0.3);
  }
`

export default function Badge({ kind }: { kind: FeedKind }) {
  return <Tag data-kind={kind}>{KIND_LABEL[kind]}</Tag>
}
