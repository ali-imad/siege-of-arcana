import { query, queryIsEmpty } from '../services/db';

const RELATION_NAME = 'player';

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<Boolean> {
  const rsp = await query(
    `INSERT INTO ${RELATION_NAME} (name, email, password, 0, 0) VALUES (${name}, ${email}, ${password});`,
  );
  return !queryIsEmpty(rsp);
}

export async function getUserByID(playerID: number): Promise<Boolean> {
  const rsp = await query(
    `SELECT * FROM ${RELATION_NAME} WHERE playerID=${playerID};`,
  );
  return !queryIsEmpty(rsp);
}

export async function updateUserByID(
  playerID: number,
  values: Record<string, string | number>,
): Promise<Boolean> {
  // build "value string" to set each key-value pair
  let valStr = '';
  for (const key in values) {
    let value = values[key];
    if (typeof value === 'number') {
      value = Math.floor(value);
    }
    valStr += `${key}=${value},`;
  }
  await query(
    `UPDATE ${RELATION_NAME} SET ${valStr} WHERE playerID=${playerID};`,
  );
  return true;
}

export async function deleteUserByID(playerID: number): Promise<Boolean> {
  await query(`DELETE FROM ${RELATION_NAME} WHERE playerID=${playerID}`);
  return true;
}
