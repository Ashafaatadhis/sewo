import prisma from "../../config/configPrisma";

export default async (username: string) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: {
      username,
    },
  });

  return isExist;
};
