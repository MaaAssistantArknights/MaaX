import fs from 'fs'
import path from 'path'

import logger from '@main/utils/logger'
import type { ReleaseObject, SourceMirror, UpdateStatus } from '../types'
import type { ComponentType } from '@type/componentManager'
import { getComponentBaseDir } from './path'

export function infoPathOf(componentDir: string) {
  const dir = path.join(getComponentBaseDir(), componentDir)
  return {
    installRoot: dir,
    currentVersion: path.join(dir, 'version'),
    latestVersion: path.join(dir, 'upgradable'),
    latestFile: path.join(dir, 'upgrade'),
  }
}

export function createCheckUpdate(
  getRelease: () => Promise<ReleaseObject | undefined>,
  assetName: {
    OTA: (current: string, latest: string) => string
    Full: () => RegExp
  },
  component: ComponentType,
  componentDir: string,
  getSource: () => SourceMirror
) {
  return async (): Promise<UpdateStatus> => {
    const release = (await getRelease()) ?? null

    if (!release) {
      logger.error(`[Component Installer | ${component}] Failed to get latest release`)
      return {
        msg: 'failedAccessLatest',
      }
    }

    const { assets, tag_name: latestVersion, published_at } = release

    const infoPath = infoPathOf(componentDir)

    if (!fs.existsSync(infoPath.installRoot)) {
      fs.mkdirSync(infoPath.installRoot, {
        recursive: true,
      })
    }

    const currentVersion = fs.existsSync(infoPath.currentVersion)
      ? fs.readFileSync(infoPath.currentVersion, 'utf-8')
      : null

    if (currentVersion === latestVersion) {
      return {
        msg: 'alreadyLatest',
      }
    }

    fs.writeFileSync(infoPath.latestVersion, latestVersion, 'utf-8')

    if (currentVersion) {
      const ota = assetName.OTA(currentVersion, latestVersion)

      logger.info(
        `[Component Installer | ${component}] Attempting to find OTA update asset: ${ota}`
      )

      const item = assets.find(asset => asset.name === ota)
      if (item) {
        logger.info(`[Component Installer | ${component}] Found update asset: ${latestVersion}`)

        fs.writeFileSync(infoPath.latestFile, item.name, 'utf-8')

        return {
          msg: 'haveUpdate',
          update: {
            url: item.browser_download_url,
            version: latestVersion,
            releaseDate: published_at,
            postUpgrade: () => {
              fs.rmSync(infoPath.currentVersion, {
                force: true,
              })
              fs.renameSync(infoPath.latestVersion, infoPath.currentVersion)
            },
          },
        }
      } else {
        logger.warn(
          `[Component Installer | ${component}] ` +
            'Unable to acquire OTA update asset, attempting to obtain full update asset'
        )
      }
    }
    // logger.debug(assets)
    const full = assetName.Full()
    const item = assets.find(asset => full.test(asset.name))

    if (!item) {
      logger.error(`[Component Installer | ${component}] Failed to retrieve core update asset`)
      return {
        msg: 'failedAccessLatest', // 考虑换一个更明确的, 如failedRetrieveLatest
      }
    }

    logger.info(`[Component Installer | ${component}] Found full asset: ${latestVersion}`)

    fs.writeFileSync(infoPath.latestFile, item.name, 'utf-8')

    return {
      msg: 'haveUpdate',
      update: {
        url: getSource().urlReplacer(item.browser_download_url),
        version: latestVersion,
        releaseDate: published_at,
        postUpgrade: () => {
          fs.rmSync(infoPath.currentVersion, {
            force: true,
          })
          fs.renameSync(infoPath.latestVersion, infoPath.currentVersion)
        },
      },
    }
  }
}
