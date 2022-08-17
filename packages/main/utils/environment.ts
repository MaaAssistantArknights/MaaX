import { GetFeatures } from '@maa/cpu-feature'

export const cpuFeature = GetFeatures()

export const cpuFlags = (): string[] => {
  const features = cpuFeature
  return Object.entries(features)
    .filter(([_, supported]) => supported)
    .map(([feature, _]) => feature)
}
