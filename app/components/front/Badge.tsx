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
  border: 1px solid rgba(255, 106, 193, 0.5);
  border-radius: 2px;
  color: #ff9bdc;
  white-space: nowrap;

  /* Each kind in the color its row title lights up in on hover (neon.ts). */
  &[data-kind='lab'] {
    color: #e0aaff;
    border-color: rgba(224, 170, 255, 0.5);
  }
  &[data-kind='release'] {
    color: #80ffea;
    border-color: rgba(128, 255, 234, 0.42);
  }
  &[data-kind='launch'] {
    color: #c3b3ff;
    border-color: rgba(195, 179, 255, 0.5);
  }
`

export default function Badge({ kind }: { kind: FeedKind }) {
  return <Tag data-kind={kind}>{KIND_LABEL[kind]}</Tag>
}
