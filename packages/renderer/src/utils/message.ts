import { MessageReactive, useMessage, MessageOptions } from "naive-ui";
import { VNodeChild } from "vue";

const messageApi = useMessage();

let message: MessageReactive | null = null;

export const hide = () => {
  if (message) {
    message.destroy();
    message = null;
  }
};

export const show = (content: string | (() => VNodeChild), options: MessageOptions) => {
  hide();
  message = messageApi.create(content, options);
};
