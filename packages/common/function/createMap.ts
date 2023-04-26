type SupportedMapType = string | number
export function createMap(
  obj: Record<SupportedMapType, SupportedMapType>
): Record<SupportedMapType, SupportedMapType> {
  ;(function (obj) {
    for (const [key, value] of Object.entries(obj)) {
      obj[(obj[key] = value)] = key
    }
  })(obj || (obj = {}))
  return obj
}
