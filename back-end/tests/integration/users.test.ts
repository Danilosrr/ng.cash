import supertest from "supertest";
import app from "../../src/app.js";
import { userFactory } from "../factories/users.factory.js";

const agent = supertest(app);

beforeEach(async () => {
  await userFactory.clearDatabase();
});

afterAll(async () => {
  await userFactory.clearDatabase();
});

describe("/signup", () => {
  const user = userFactory.validUser();

  it("expect successful sign up", async () => {
    const request = await agent.post("/signup").send(user);
    expect(request.status).toBe(201);

    const savedUser = await userFactory.findUser(user.username);
    expect(savedUser).not.toBeNull();
  });

  it("unavailabe username > expect conflict error", async () => {
    const request = await agent.post("/signup").send(user);
    expect(request.status).toBe(201);

    const { status } = await agent.post("/signup").send(user);
    expect(status).toBe(409);
  });
});

describe("/signin", () => {
  it("expect sucessful sign in", async () => {
    const user = userFactory.validUser();
    await userFactory.createNewUser(user);

    const request = await agent.post("/signin").send(user);
    expect(request.status).toBe(200);
    expect(request.body.token).not.toBeNull();
  });

  it("password mismatch > expect forbiden error", async () => {
    const user = userFactory.validUser();
    await userFactory.createNewUser(user);

    const request = await agent.post("/signin").send({
      ...user,
      password: userFactory.validPassword(),
    });
    expect(request.status).toBe(403);
  });

  it("username mismatch > expect not found error", async () => {
    const user = userFactory.validUser();
    await userFactory.createNewUser(user);

    const request = await agent.post("/signin").send({
      ...user,
      username: userFactory.validUsername(),
    });
    expect(request.status).toBe(404);
  });
});
