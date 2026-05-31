// Standard-ish Unix commands, themed to the hyperbliss stack. Registry commands
// win over the shell, so these give `ps`, `dmesg`, `uptime`, and friends real
// (if playful) output instead of a "command not found". Self-registers on import.

import { styled } from '../../../../styled-system/jsx'
import { registry } from '../registry'
import { text } from '../render'
import { Block, Muted, Ok } from './ui'

const Pre = styled.pre`
  margin: 0;
  font-family: var(--font-mono);
  white-space: pre;
  overflow-x: auto;
  color: var(--text-primary);
  padding: var(--space-1) 0;
`

const pad2 = (n: number) => n.toString().padStart(2, '0')
const clock = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`

// ── uptime ──────────────────────────────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'uptime',
  run: () => text(` ${clock(new Date())} up 42 days,  13:37,  1 user,  load average: 0.42, 0.37, 0.31`, 'system'),
  summary: 'how long the dream has been running',
})

// ── ps / top ────────────────────────────────────────────────────────────────

const PROCS: Array<[string, string, string, string]> = [
  ['1', '?', '00:00:01', '/sbin/init'],
  ['42', 'tty1', '13:37:00', 'cyberscape --particles=5000'],
  ['108', 'tty1', '00:04:20', 'silkcircuit --theme=neon'],
  ['256', 'tty1', '02:11:09', 'sibyl --recall --watch'],
  ['420', 'tty1', '00:09:18', 'chromacat < /dev/dreams'],
  ['512', 'tty1', '00:00:42', 'git-iris commit --magic'],
  ['1024', 'tty1', '07:30:00', 'ghostty --gpu'],
  ['2048', 'pts/0', '00:00:00', 'ps aux'],
]

const psTable = () => {
  const header = `${'PID'.padEnd(6)} ${'TTY'.padEnd(8)} ${'TIME'.padEnd(9)} CMD`
  const rows = PROCS.map(([pid, tty, t, cmd]) => `${pid.padEnd(6)} ${tty.padEnd(8)} ${t.padEnd(9)} ${cmd}`)
  return <Pre>{[header, ...rows].join('\n')}</Pre>
}

registry.register({
  aliases: ['top', 'htop'],
  group: 'fun',
  name: 'ps',
  run: () => psTable(),
  summary: 'what is running (everything, always)',
})

// ── dmesg ───────────────────────────────────────────────────────────────────

const DMESG = [
  '[    0.000000] hyperbliss kernel 6.6.6-silk booting',
  '[    0.042000] silkcircuit: neon subsystem online',
  '[    0.137000] cyberscape: particle field initialized (5000 nodes)',
  '[    0.420000] gpu: webgl context acquired, shaders compiled',
  '[    1.024000] fs: virtual content tree mounted at /',
  '[    1.337000] shell: just-bash ready',
  '[    2.718000] axolotl0: regenerating limbs (this is fine)',
  '[    3.141000] net: vibes synchronized',
  '[    3.330000] terminal: ready ✦',
]

registry.register({
  group: 'fun',
  name: 'dmesg',
  run: () => <Pre>{DMESG.join('\n')}</Pre>,
  summary: 'kernel ring buffer (mostly good news)',
})

// ── free ────────────────────────────────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'free',
  run: () => (
    <Pre>
      {[
        `${''.padEnd(7)}${'total'.padStart(8)}${'used'.padStart(8)}${'free'.padStart(8)}`,
        `${'Mem:'.padEnd(7)}${'16384'.padStart(8)}${'13370'.padStart(8)}${'3014'.padStart(8)}`,
        `${'Swap:'.padEnd(7)}${'2048'.padStart(8)}${'42'.padStart(8)}${'2006'.padStart(8)}`,
      ].join('\n')}
    </Pre>
  ),
  summary: 'memory, mostly spent on ideas',
})

// ── df ──────────────────────────────────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'df',
  run: () => (
    <Pre>
      {[
        `${'Filesystem'.padEnd(14)}${'Size'.padStart(6)}${'Used'.padStart(6)}${'Avail'.padStart(7)}  Mounted on`,
        `${'/dev/silk0'.padEnd(14)}${'24P'.padStart(6)}${'18P'.padStart(6)}${'6P'.padStart(7)}  /`,
        `${'content'.padEnd(14)}${'∞'.padStart(6)}${'—'.padStart(6)}${'∞'.padStart(7)}  /content`,
      ].join('\n')}
    </Pre>
  ),
  summary: 'disk usage (plenty of room to dream)',
})

// ── whoami / date / uname ─────────────────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'whoami',
  run: () => (
    <Block>
      <div>
        <Ok>guest</Ok>
      </div>
      <Muted>be anyone here — but if you want the real one, try `about`</Muted>
    </Block>
  ),
  summary: 'who you are right now',
})

registry.register({
  group: 'fun',
  name: 'date',
  run: () => text(new Date().toString()),
  summary: 'the current moment',
})

registry.register({
  group: 'fun',
  name: 'uname',
  run: () => text('Hyperbliss SilkCircuit 6.6.6-neon x86_64 GNU/Linux'),
  summary: 'system identity',
})
