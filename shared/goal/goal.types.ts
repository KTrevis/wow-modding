export type Goal = {
  id: string;
  title: string;
  description: string;
  current: number;
  required: number;
  claimed?: boolean;
};
