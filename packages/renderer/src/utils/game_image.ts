import axios from "axios";

const baseUrl = "https://prts.wiki/rest.php/v1/file/File:";

export async function getOperatorAvatar(operator_code: string) {
  const filename = `头像_${operator_code}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}

export async function getOperatorHalfImage(operator_code: string) {
  const filename = `半身像_${operator_code}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}

export async function getOperatorFullImage(operator_code: string) {
  const filename = `立绘_${operator_code}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}

export async function getSkillImage(skill_name: string) {
  const filename = `技能_${skill_name}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}

export async function getItemBorderedImage(item_name: string) {
  const filename = `道具_带框_${item_name}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}

export async function getActivityImage(activity_name: string) {
  const filename = `活动名称_${activity_name}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}

export async function getMainlineImage(mainline_name: string) {
  const filename = `章节名称_${mainline_name}.png`;
  const url = new URL(`${baseUrl}${filename}`);
  const response = await axios.get(url.href);
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url}`;
  }
  return "";
}
  