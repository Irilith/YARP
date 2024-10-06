export type BaseAccount = {
  key: string;
  name: string;
  computer: string;
  updated_at: string;
  [key: string]: string | number;
};

export type GameConfig = {
  name: string;
  endpoint: string;
  columns: Array<{
    enable: boolean;
    key: string;
    label?: string;
    sortable?: boolean;
  }>;
};
