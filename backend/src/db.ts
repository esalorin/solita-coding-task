import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: 'academy',
  host: 'localhost',
  database: 'electricity',
  password: 'academy',
  port: 5432,
});

export default pool;
