import supertest from "supertest";
import app from "../../src/app.js";
import { transactionsFactory } from "../factories/transactions.factory.js";
import { userFactory } from "../factories/users.factory.js";

const agent = supertest(app);

beforeEach(async () => {
  await userFactory.clearDatabase();
});

afterAll(async () => {
  await userFactory.clearDatabase();
});

describe("/balance", () => {
  const user1 = userFactory.validUser();
  const user2 = userFactory.validUser();

  it("expect to successfully register transaction", async () => {
    const token = await userFactory.getToken(user1);
    await userFactory.getToken(user2);

    const transaction = await agent
      .post("/transaction")
      .set("Authorization", `Bearer ${token}`)
      .send({
        receiver: user2.username,
        value: 5,
      });
    expect(transaction.status).toBe(201);
  });

  it("unregistered user > expect not found error", async () => {
    const token = await userFactory.getToken(user1);

    const transaction = await agent
      .post("/transaction")
      .set("Authorization", `Bearer ${token}`)
      .send({
        receiver: user2.username,
        value: 5,
      });
    expect(transaction.status).toBe(404);
  });

  it("self transaction > expect forbidden error", async () => {
    const token = await userFactory.getToken(user1);
    const user = await userFactory.findUser(user1.username);

    const transaction = await agent
      .post("/transaction")
      .set("Authorization", `Bearer ${token}`)
      .send({
        receiver: user1.username,
        value: 5,
      });
    expect(transaction.status).toBe(403);

    const transactions = await transactionsFactory.getAccountDebits(
      user.accountId
    );
    expect(transactions.length).toEqual(0);
  });
});
