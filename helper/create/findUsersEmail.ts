import prisma from "../../config/configPrisma";
import type findUsersEmailType from "../../types/findUsersEmailType";
export default async (user: findUsersEmailType) => {
  const isExist = await prisma.users_email.findFirst({
    where: {
      AND: {
        email: user.email,
        provider: user.provider,
      },
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  return isExist;
};
