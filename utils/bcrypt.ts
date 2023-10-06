import bcrypt from "bcrypt";
import HttpError from "./errors/HttpError";

const hash = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export default hash;
