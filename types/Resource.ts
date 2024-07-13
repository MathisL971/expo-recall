export type Resource = {
  id: string;
  title: string;
  author: string;
  numPages: number;
};

export type ResourceWithIsSaved = Resource & {
  isSaved: boolean;
};
