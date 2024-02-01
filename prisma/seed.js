const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const password = bcrypt.hashSync("123456");
const userData = [
  { username: "andy", password, email: "andy@gmail.com" },
  { username: "toffo", password, email: "togppo@gmail.com" },
  { username: "wtpl", password, email: "wpddd@gmail.com" },
];

const todoData = [
  { title: "Learn HTML", duedate: new Date(), user_id: 1 },
  { title: "Learn CSS", duedate: new Date(), user_id: 2 },
  { title: "Learn JAVA", duedate: new Date(), user_id: 3 },
];

const run = async () => {
  //await prisma.user.deleteMany({});
  //await prisma.todo.deleteMany({});
  await prisma.user.createMany({
    data: userData,
  });

  await prisma.todo.createMany({
    data: todoData,
  });
};

run();
