const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  store: async (req, res, next) => {
    try {
      let { name, email, password, identity_type, identity_number, address } =
        req.body;

      let exist = await prisma.user.findFirst({
        where: { email },
      });

      if (exist) {
        return res.status(400).json({
          status: false,
          message: "email already used",
        });
      }

      let user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          profile: {
            create: { identity_type, identity_number, address },
          },
        },
        include: {
          profile: true,
        },
      });

      res.status(201).json({
        status: true,
        message: "User dan Profile berhasil didaftarkan",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  index: async (req, res, next) => {
    try {
      let users = await prisma.user.findMany({
        orderBy: { id: "asc" },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      let userId = Number(req.params.userId);
      let user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User tidak ditemukan dengan userId " + userId,
        });
      }

      res.status(200).json({
        status: true,
        message: "OK",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
