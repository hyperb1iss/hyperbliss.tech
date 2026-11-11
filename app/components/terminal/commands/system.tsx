// The two Unix staples a visitor types out of habit. Registry commands win
// over the shell, so these answer plainly instead of "command not found".
// Self-registers on import.

import { registry } from '../registry'
import { text } from '../render'

registry.register({
  group: 'fun',
  name: 'whoami',
  run: () => text('guest'),
  summary: 'who you are right now',
})

registry.register({
  group: 'fun',
  name: 'date',
  run: () => text(new Date().toString()),
  summary: 'the current date and time',
})
