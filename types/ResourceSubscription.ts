import { Resource } from "./Resource";

export type ResourceSubscription = {
  id: string;
  userId: string;
  resource: Resource;
  maxPage: number;
  shouldQuiz: boolean;
};
