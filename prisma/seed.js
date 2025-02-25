const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userData = [
  { username: "andy", password: "1234", email: "andy@gmail.com" },
  { username: "tai", password: "1234", email: "tai@gmail.com" },
  { username: "wtpl", password: "1234", email: "wpddd@gmail.com" },
  { username: "admin", password: "1234", email: "andy2@gmail.com",role: "admin" },
  { username: "admin2", password: "1234", email: "tai1@gmail.com",role: "admin" },
  { username: "test01", password: "1234", email: "family4485@gmail.com"},
];

const run = async () => {
  //await prisma.user.deleteMany({});
  //await prisma.todo.deleteMany({});
  await prisma.user.createMany({
    data: userData,
  });

};

run();
