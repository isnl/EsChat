import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "node:path";

interface User {
  id: string;
  openId: string;
  avatar: string;
  name: string;
  createdAt: string;
}

const user = new Low<User[]>(
  new JSONFile(join(process.cwd(), "/db/users.json")),
  []
);

export default user;
