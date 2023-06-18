import fs, { truncate } from "fs";
import zlib from "zlib";
import { promisify } from "util";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gzipContent = fs.readFileSync("devfiles/dummy-data-list.json.gz");

const binary = await promisify(zlib.gunzip)(gzipContent);

const parsedData = JSON.parse(binary.toString());

console.log(parsedData.length);

const startDate = new Date(2001, 0, 1); // 0はJanuary
const endDate = new Date(2022, 11, 31); // 11はDecember

function getRandomDate(startDate: Date, endDate: Date) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = Math.random() * (end - start) + start;
  return new Date(randomTime);
}

const truncateData = async (prisma: PrismaClient) => {
  process.stdout.write(`Truncate All Data\n`);
  await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`;
  await prisma.$queryRawUnsafe("TRUNCATE User;");
  await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`;
};

truncateData(prisma);

for (let i = 0; i < parsedData.length; i++) {
  const element: string[] = parsedData[i];
  const id =
    (Math.floor(Math.random() * 64) << 24) |
    (i << 4) |
    Math.floor(Math.random() * 16);
  const createdAt = getRandomDate(startDate, endDate);
  const updatedAt = getRandomDate(createdAt, endDate);
  const user = {
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
  await prisma.user.create({ data: user });
  console.log(user);
  if (i > 100) break;
}
