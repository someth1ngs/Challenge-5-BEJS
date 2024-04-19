const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  store: async (req, res, next) => {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      const sourceAccount = await prisma.bank_Account.findUnique({
        where: { id: source_account_id },
      });

      const destinationAccount = await prisma.bank_Account.findUnique({
        where: { id: destination_account_id },
      });

      if (!sourceAccount || !destinationAccount) {
        return res.status(404).json({
          true: false,
          message: "Untuk pengirim atau penerima tidak valid",
        });
      }

      if (sourceAccount.balance < amount) {
        return res.status(400).json({
          true: false,
          message: "Saldo tidak mencukupi",
        });
      }

      const transferTransaction = await prisma.transaction.create({
        data: {
          amount,
          sourceAccounts: {
            connect: {
              id: source_account_id,
            },
          },
          destinationAccounts: {
            connect: {
              id: destination_account_id,
            },
          },
        },
      });

      await prisma.bank_Account.update({
        where: { id: source_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.bank_Account.update({
        where: { id: destination_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
        res.status(200).json({
          status: true,
          message: "Transfer Sukses",
          data: transferTransaction,
        });
    } catch (error) {
      next(error);
    }
  },

  index: async (req, res, next) => {
    try {
      let transactions = await prisma.transaction.findMany({
        orderBy: { id: "asc" },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      let transaction = await prisma.transaction.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          sourceAccounts: true,
          destinationAccounts: true,
        },
      });

      if (!transaction) {
        return res.status(400).json({
          status: false,
          message:
            "transaksi tidak ditemukan dengan id Transaksi " +
            Number(req.params.id),
        });
      }

      res.status(200).json({
        status: true,
        message: "OK",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
};
