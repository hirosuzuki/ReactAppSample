import fs from "fs";
import zlib from "zlib";
import { promisify } from "util";

import randseed from "random-seed";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rand = randseed.create("ReactAppSample");

function getRandomDate(startDate: Date, endDate: Date) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = rand.intBetween(start, end);
  return new Date(randomTime);
}

const truncateData = async (prisma: PrismaClient) => {
  process.stdout.write(`Truncate All Data\n`);
  await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`;
  await prisma.$queryRawUnsafe("TRUNCATE Customer;");
  await prisma.$queryRawUnsafe("TRUNCATE User;");
  await prisma.$queryRawUnsafe("TRUNCATE UserSection;");
  await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`;
};

const postCustomers = async (prisma: PrismaClient) => {
  process.stdout.write(`Post Customers\n`);

  const gzipContent = fs.readFileSync("devfiles/dummy-data-list.json.gz");

  const binary = await promisify(zlib.gunzip)(gzipContent);

  const parsedData = JSON.parse(binary.toString());

  const startDate = new Date(2001, 0, 1); // 0はJanuary
  const endDate = new Date(2022, 11, 31); // 11はDecember

  const batchPostSize = 1000;

  for (let i = 0; i < parsedData.length; i += batchPostSize) {
    const rows = Array.from(Array(batchPostSize).keys()).map((j) => {
      const pos = i + j;
      const element = parsedData[pos];
      const id = (rand.range(64) << 24) | (pos << 4) | rand.range(16);
      const createdAt = getRandomDate(startDate, endDate);
      const updatedAt = getRandomDate(createdAt, endDate);
      const customer = {
        id: id,
        name: element[0],
        furigana: element[1],
        birthday: new Date(element[2]),
        sex: element[3],
        bloodtype: element[4],
        email: element[5],
        telephone: element[6],
        zipcode: element[7],
        address: element[8],
        company: element[9],
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
      return customer;
    });
    await prisma.customer.createMany({ data: rows });
    process.stdout.write(
      `  created ${i + batchPostSize} / ${parsedData.length} rows\r`
    );
  }
  process.stdout.write(`\n`);
};

const postUsers = async (prisma: PrismaClient) => {
  process.stdout.write(`Post Users\n`);

  const content = fs.readFileSync("devfiles/users.json");
  const { userSections, users } = JSON.parse(content.toString());

  type UserSection = {
    code: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };

  await prisma.userSection.createMany({
    data: userSections.map((e: UserSection) => ({
      code: e.code,
      name: e.name,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  });

  type User = {
    id: number;
    username: string;
    name: string;
    passwordHash: string;
    level: number;
    section: { code: string };
    createdAt: Date;
    updatedAt: Date;
  };

  await prisma.user.createMany({
    data: users.map((e: User) => ({
      id: e.id,
      email: e.username + "@rsappinc.co.jp",
      name: e.name,
      passwordHash: e.passwordHash,
      level: e.level,
      userSectionCode: e.section.code,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  });
};

await truncateData(prisma);
await postUsers(prisma);
await postCustomers(prisma);
