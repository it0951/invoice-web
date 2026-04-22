import "server-only";

import bcrypt from "bcrypt";

/** bcrypt 해시와 평문 비밀번호 비교 */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
