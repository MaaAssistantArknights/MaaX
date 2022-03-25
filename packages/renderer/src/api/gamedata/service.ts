import ApiService from "../ApiService";

/** 
 * ! important: 
 * ! 这只会在开发环境起作用，在打包后会显示找不到文件
 * ! 请务必在release之前把这个更换为gamedata服务器
 * 
*/
const service = new ApiService("/gamedata");

export default service;
