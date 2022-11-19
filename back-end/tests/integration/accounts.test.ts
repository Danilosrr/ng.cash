import supertest from "supertest";
import app from "../../src/app.js";
import { accountFactory } from "../factories/accounts.factory.js";
import { userFactory } from "../factories/users.factory.js";

const agent = supertest(app);

beforeAll(async () => {
  await accountFactory.clearDatabase();
});

describe("/extract", () => {
  const user = userFactory.validUser();

  it("expect to sucessfully get extract", async () => {
    const token = await accountFactory.getToken(user);

    const request = await agent
      .get("/extract")
      .set("Authorization", `Bearer ${token}`);
    expect(request.status).toBe(200);
  });
});
