import { DocumentReference } from "firebase/firestore";
import { Resource } from "./Resource";

export enum QuestionEnum {
  "MCQ",
  "SHORT",
  "LONG",
}

export type Question = {
  id: string;
  prompt: string;
  choices: string[];
  answer: string;
  type: QuestionEnum;
  selection: string | null;
  resource: Resource;
  userId: string;
  dateCreated: number;
};

export type StoredQuestion = {
  prompt: string;
  choices: string[];
  answer: string;
  type: QuestionEnum;
  selection: string | null;
  resource: DocumentReference;
  userId: string;
  dateCreated: number;
};
