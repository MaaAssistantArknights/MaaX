import service from "./service";

interface ItemQuery {
  name?: string;
  limit?: number;
  page?: number;
}

interface StageQuery {
  stage_id?: string;
  stage_type?: string;
  stage_code?: string;
  ap_cost_lower_limit?: string;
  ap_cost_up_limit?: string;
  zone_id?: string;
  zone_name?: string;
  zone_type?: string;
  available_cn?: string;
  available_kr?: string;
  available_us?: string;
  available_jp?: string;
  limit?: string;
  page?: string;
}

interface ZoneQuery {
  zone_id?: string;
  zone_name?: string;
  zone_type?: string;
  available_cn?: string;
  available_kr?: string;
  available_us?: string;
  available_jp?: string;
  limit?: string;
  page?: string;
}

export default {
  items: {
    async get(name: string) {
      return await service.get(`/game-data/item/${name}`) as Api.Maa.Item;
    },
    async list(query: ItemQuery) {
      return await service.get("/game-data/item", {
        params: query,
      }) as Array<Api.Maa.Item>;
    },
    imageLink(name: string) {
      return `${service.baseUrl}/files/game-data/items/${name}.png`;
    },
  },
  stages: {
    async get(stage_code: string) {
      return await service.get(`/game-data/stage/${stage_code}`) as Api.Maa.Stage;
    },
    async list(query: StageQuery) {
      return await service.get("/game-data/stage", {
        params: query,
      }) as Array<Api.Maa.Stage>;
    },
  },
  zones: {
    async get(zone_id: string) {
      return await service.get(`/game-data/zone/${zone_id}`) as Api.Maa.Zone;
    },
    async list(query: ZoneQuery) {
      return await service.get("/game-data/zone", {
        params: query,
      }) as Array<Api.Maa.Zone>;
    },
  },
};
