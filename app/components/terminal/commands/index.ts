// Importing this module registers every command group into the shared registry
// (each file self-registers as a side effect). The composition layer imports it
// once; the Terminal then reads commands from the shared registry.

import './meta'
import './info'
import './content'
import './neofetch'
import './fun'
import './system'

export { registry } from '../registry'
