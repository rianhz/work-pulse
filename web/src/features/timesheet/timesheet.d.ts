export interface ITimeSheet {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  project: { id: string; name: string; };
  payAs: string
}