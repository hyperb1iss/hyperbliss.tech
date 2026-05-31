const args = process.argv.slice(2)

if (args.includes('--restore')) {
  console.log('No restore needed; bundle analysis does not mutate project files.')
  process.exit(0)
}

const { spawn } = await import('node:child_process')

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} ${args.join(' ')} terminated by ${signal}.`))
        return
      }
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 1}.`))
        return
      }
      resolve()
    })
  })
}

try {
  await run('pnpm', ['exec', 'panda'])
  await run('pnpm', ['exec', 'next', 'build', '--experimental-analyze'])
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}
