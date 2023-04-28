import detectSystemProxy from '@main/utils/proxy'
import WindowManager from '@main/windowManager'
import type { AxiosProxyConfig } from 'axios'

export async function getProxy() {
  const proxyUrl = await detectSystemProxy(new WindowManager().getWindow())
  if (proxyUrl) {
    const { protocol, hostname, port, username, password } = new URL(proxyUrl)
    const cfg: AxiosProxyConfig = {
      host: hostname,
      port: Number(port),
      protocol,
      auth: {
        username,
        password,
      },
    }
    return cfg
  }
  return undefined
}
