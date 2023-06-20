import fs from "fs";
import bcrypt from "bcrypt";

const startDate = new Date(2022, 0, 1); // 2022年1月1日
const endDate = new Date(2023, 6, 1); // 2023年7月1日
const saltRounds = 10;

const userLevels = [1, 10, 100];

const user_sections_conts = fs.readFileSync("devfiles/user-sections.txt");
const users_conts = fs.readFileSync("devfiles/users.txt");

const randInt = (max: number) => Math.floor(Math.random() * max);

const getRandomDate = (startDate: Date, endDate: Date) => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + randInt(end - start);
  return new Date(randomTime);
};

const userSections = user_sections_conts
  .toString()
  .split("\n")
  .map((line, index) => {
    const id = (randInt(64) << 20) | (index << 4) | (randInt(8) << 1);
    const vs = line.split(" - ");
    const name = vs[0];
    const code = "US" + vs[1].replace(/-/g, "");
    const createdAt = getRandomDate(startDate, endDate);
    const updatedAt = getRandomDate(createdAt, endDate);
    return { index, id, code, name, createdAt, updatedAt };
  });

const users = users_conts
  .toString()
  .split("\n")
  .map((line, index) => {
    const [name, furigana] = line.split("\t");
    const id = (randInt(64) << 20) | (index << 4) | (randInt(8) << 1) | 1;
    const username = furigana.toLowerCase().replace(" ", ".");
    const level = userLevels[randInt(userLevels.length)];
    const section = userSections[randInt(userSections.length)];
    const createdAt = getRandomDate(startDate, endDate);
    const updatedAt = getRandomDate(createdAt, endDate);
    const password = "password";
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    return {
      index,
      id,
      name,
      furigana,
      username,
      level,
      section,
      passwordHash,
      createdAt,
      updatedAt,
    };
  });

process.stdout.write(JSON.stringify({ userSections, users }, null, 2));
