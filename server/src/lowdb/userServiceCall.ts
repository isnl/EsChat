import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "node:path";

interface UserServiceCall {
  user_id: string;
  date: string;
  count: number;
  history: string[];
}

export default new Low<UserServiceCall[]>(
  new JSONFile(join(process.cwd(), "/db/userServiceCalls.json")),
  []
);
