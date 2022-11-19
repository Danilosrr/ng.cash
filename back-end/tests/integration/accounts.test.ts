import supertest from "supertest";
import app from "../../src/app.js";
import { accountFactory } from "../factories/accounts.factory.js";
import { userFactory } from "../factories/users.factory.js";

const agent = supertest(app);

beforeEach(async () => {
  await accountFactory.clearDatabase();
});

describe("/extract", () => {
  const user1 = userFactory.validUser();
  const user2 = userFactory.validUser();

  it("expect to sucessfully get extract", async () => {
    const userToken = await accountFactory.getToken(user1);

    const request = await agent
      .get("/extract")
      .set("Authorization", `Bearer ${userToken}`);
    expect(request.status).toBe(200);
    expect(request.body.length).toEqual(0);
  });

  it("expect to sucessfully get filtered extract", async () => {
    const token = await accountFactory.getToken(user1);
    await accountFactory.getToken(user2);

    const date = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    await agent
      .post("/transaction")
      .set("Authorization", `Bearer ${token}`)
      .send({
        receiver: user2.username,
        value: 50,
      });

    const request = await agent
      .get("/extract")
      .set("Authorization", `Bearer ${token}`);
    expect(request.body.length).toEqual(1);

    const typeFiltered = await agent
      .get("/extract?type=credit")
      .set("Authorization", `Bearer ${token}`);
    expect(typeFiltered.body.length).toEqual(0);

    const dateFiltered = await agent
      .get(`/extract?date=${date}`)
      .set("Authorization", `Bearer ${token}`);
    expect(dateFiltered.body.length).toEqual(1);
  });
});
