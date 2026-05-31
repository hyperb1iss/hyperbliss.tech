// Command registry. Each command group self-registers into the shared
// `registry` singleton at import time (commands/index.ts wires them up), which
// keeps command groups in independent files. Tests construct their own
// `Registry` for isolation.

import type { Command, CommandRegistry } from './types'

export class Registry implements CommandRegistry {
  private commands = new Map<string, Command>()
  private aliases = new Map<string, string>()
  private order: string[] = []

  register(command: Command): void {
    if (!this.commands.has(command.name)) this.order.push(command.name)
    this.commands.set(command.name, command)
    for (const alias of command.aliases ?? []) this.aliases.set(alias, command.name)
  }

  get(nameOrAlias: string): Command | undefined {
    const name = this.commands.has(nameOrAlias) ? nameOrAlias : this.aliases.get(nameOrAlias)
    return name ? this.commands.get(name) : undefined
  }

  all(): Command[] {
    return this.order.map((n) => this.commands.get(n)).filter((c): c is Command => Boolean(c))
  }

  visible(): Command[] {
    return this.all().filter((c) => !c.hidden)
  }

  names(): string[] {
    return [...this.commands.keys(), ...this.aliases.keys()]
  }
}

/** Shared registry the app populates via commands/index.ts side-effect imports. */
export const registry = new Registry()
