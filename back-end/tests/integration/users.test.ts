import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/Config/database.js";

const agent = supertest(app);

describe("integration test", () => {
  beforeEach(async () => {
    await prisma.users.deleteMany();
  });

  it("should register user", async () => {
    const user = { username: "Danilo", password: "Senha123" };

    const { status } = await agent.post("/signUp").send(user);
    expect(status).toBe(201);

    const savedUser = await prisma.users.findUnique({
      where: {
        username: "Danilo",
      },
    });
    expect(savedUser).not.toBeNull();
  });
});
