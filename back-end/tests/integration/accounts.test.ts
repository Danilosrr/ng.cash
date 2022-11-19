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

describe("/balance", () => {
  const user = userFactory.validUser();

  it("expect to successfully get account balance", async () => {
    const token = await userFactory.getToken(user);

    const request = await agent
      .get("/balance")
      .set("Authorization", `Bearer ${token}`);
    expect(request.status).toBe(200);
    expect(request.body.balance).toEqual(100);
  });
});

describe("/extract", () => {
  const user1 = userFactory.validUser();
  const user2 = userFactory.validUser();

  it("expect to sucessfully get extract", async () => {
    const token = await userFactory.getToken(user1);

    const request = await agent
      .get("/extract")
      .set("Authorization", `Bearer ${token}`);
    expect(request.status).toBe(200);
    expect(request.body.length).toEqual(0);
  });

  it("date filter & type filter > expect to successfuly filter extract", async () => {
    const token = await userFactory.getToken(user1);
    await userFactory.getToken(user2);

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
