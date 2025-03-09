import { FakeEntity } from "./entity";

export interface List extends FakeEntity {
  name: string;
  order: number;
}

export interface ListItem extends FakeEntity {
  order: number;
  description: string;
  note: string;
  dueDate: Date | null;
  listId: FakeEntity['id']
}