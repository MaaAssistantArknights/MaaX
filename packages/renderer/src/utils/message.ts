import {  MessageOptions } from "naive-ui";
import { VNodeChild } from "vue";


export const hide = () => {
  window.$message.destroyAll();};

export const show = (content: string | (() => VNodeChild), options: MessageOptions) => {
  hide();
  window.$message.create(content, options);
};
