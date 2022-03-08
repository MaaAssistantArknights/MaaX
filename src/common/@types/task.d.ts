type TaskRunningType = {
  label: string;
  value: string;
  status: 'normal' | 'success' | 'exception';
  progress: number;
  enabled: boolean;
};
