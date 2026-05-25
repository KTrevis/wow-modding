export type Goal = {
  id: string;
  category: string;
  title: string;
  description: string;
  current: number;
  required: number;
  claimed: boolean;
};
