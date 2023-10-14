import { compare } from "bcrypt";

export default async (plain: string, hash: string): Promise<boolean> => {
  try {
    const comp = await compare(plain, hash);
    return comp;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
