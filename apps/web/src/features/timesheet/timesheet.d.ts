import { IProject } from "../projects/project";

export interface ITimeSheet {
  _id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  project: { id: string; name: string; };
  payAs: string
}