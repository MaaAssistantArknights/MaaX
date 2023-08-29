import { spawn } from 'child_process'
import { createServer, build } from 'vite'
import electron from 'electron'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url';


let aliveInst = 0
let quitTimer = null

function startQuit() {
  quitTimer = setTimeout(() => {
    process.exit(0)
  }, 5000)
}

function stopQuit() {
  if (quitTimer) {
    clearTimeout(quitTimer)
    quitTimer = null
  }
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchMain(server) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null
  const address = server.httpServer.address()
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port,
  })

  return build({
    configFile: 'packages/main/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-main-watcher',
        writeBundle() {
          stopQuit()
          aliveInst += 1
          electronProcess && electronProcess.kill()
          electronProcess = spawn(electron, ['.', '--inspect'], {
            stdio: 'inherit',
            env,
          })
          electronProcess.on('exit', () => {
            aliveInst -= 1
            if (aliveInst === 0) {
              startQuit()
            }
          })

        },
      },
    ],
    build: {
      watch: true,
    },
  })
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchPreload(server) {
  return build({
    configFile: 'packages/preload/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-preload-watcher',
        writeBundle() {
          server.ws.send({ type: 'full-reload' })
        },
      },
    ],
    build: {
      watch: true,
    },
  })
}

function installKoffiBinaries() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  console.log(currentDir)
  fs.copySync(path.resolve(currentDir, '../node_modules/koffi/build'), path.resolve(currentDir, '../node_modules/electron/dist/resources'));
}

installKoffiBinaries()
// bootstrap
const server = await createServer({
  configFile: 'packages/renderer/vite.config.ts',
})

await server.listen()
await watchPreload(server)
await watchMain(server)
