import service from "./service";

export default {
  async getAllStages() {
    return await service.get("/stage_table.json");
  },
  async getAllActivities() {
    return await service.get("/activity_table.json");
  },
  async getAllItems() {
    return await service.get("/item_table.json");
  },
  async getAllOperators() {
    return await service.get("/character_table.json");
  },
  async getAllSkills() {
    return await service.get("/skill_table.json");
  },
  async getAllZones() {
    return await service.get("/zone_table.json");
  }
};