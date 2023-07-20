export type TileClickData = {
  height: number
  index: number
  maaLocation: [number, number]
  tile: {
    blackboard: null
    buildableType: number
    effects: null
    heightType: number
    passableMask: number
    playerSideMask: number
    tileKey:
      | 'tile_floor'
      | 'tile_empty'
      | 'tile_wall'
      | 'tile_forbidden'
      | 'tile_start'
      | 'tile_flystart'
      | 'tile_end'
      | 'tile_fence_bound'
    // others
  }
}


export type RecvMsg = {
  id: string
} & (
  | {
      type: 'mapReady'
    }
  | {
      type: 'tileClick'
      data: TileClickData
    }
)

export type MapState = {
  activeTiles: {
    x: number
    y: number
  }[]
}

export type SendMsg = {
  id: string
} & (
  | {
      type: 'checkMap'
    }
  | {
      type: 'setMapState'
      data: MapState
    }
)
// ack:**** ?
