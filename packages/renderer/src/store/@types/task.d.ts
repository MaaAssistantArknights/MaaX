type TaskStatus = "idle" | "processing" | "success" | "exception";

interface Task {
  /**
   * @props 任务唯一string id
   */
  id: string;
  /**
   * @props 任务title（可能为i18n字符串，i18n example: `t("task.mall")`）
   */
  title: string;
  /**
   * @props 任务状态
   * ---
   * @idle 空闲的，暂未进行到的，可编辑配置
   * @processing 正在进行的
   * @success 进行完成且成功执行的
   * @exception 进行完成但失败的
   */
  status: TaskStatus;
  /**
   * @props 是否启用任务
   */
  enable: boolean;
  /**
   * @props 任务开始时间（时间戳，在任务开始时由Date.now()返回）
   */
  startTime?: number;
  /**
   * @props 任务结束时间
   */
  endTime?: number;
  /**
   * @props 任务进行进度，范围0-100
   */
  progress?: number;
  /**
   * @props 任务的相关配置项
   * @example
   * [
   *   {
   *      label: 'refresh',
   *      value: true
   *   }
   * ]
   */
  configurations: Record<string, unknown>;
}
