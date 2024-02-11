const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const password = bcrypt.hashSync("");
const userData = [
  { username: "andy", password, email: "andy@gmail.com" },
  { username: "tai", password, email: "tai@gmail.com" },
  { username: "wtpl", password, email: "wpddd@gmail.com" },
];

const run = async () => {
  //await prisma.user.deleteMany({});
  //await prisma.todo.deleteMany({});
  await prisma.user.createMany({
    data: userData,
  });


};

run();
