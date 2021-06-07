const db = require("../services/db");
db.query = jest.fn();

jest.mock("../midlewares/isAuthenticated"); // this happens automatically with automocking
const isAuthenticated = require("../midlewares/isAuthenticated");
isAuthenticated
  .mockImplementationOnce(() => {
    return {
      user_id: 1,
    };
  })
  .mockImplementationOnce(() => {
    return {
      user_id: 2,
    };
  })
  .mockImplementationOnce(() => {
    throw new Error("test error");
  });

const { resolver } = require("../src/graphql/contact/resolver");

const users = [
  { user_id: 1, name: "Test test", email: "test@test.test", password: "test" },
];

const contacts = [
  { user_id: 1, contact_id: 1, name: "Tester Tester", number: "1234" },
  { user_id: 1, contact_id: 2, name: "Tester2 Tester2", number: "123456" },
];

db.query
  .mockReturnValueOnce({ rows: contacts })
  .mockReturnValueOnce({ rows: [] });

test("Get all contacts test", async () => {
  const getAllContacts = resolver.Query.getAllContacts;
  const res1 = await getAllContacts(undefined, undefined, { db });
  expect(res1).toEqual(contacts);

  const res2 = await getAllContacts(undefined, undefined, { db });
  expect(res2).toEqual([]);

  // getAllContacts(undefined, undefined, { db }).rejects.toThrow(
  //   "Login credentials error!"
  // );
  await expect(getAllContacts(undefined, undefined, { db })).rejects.toThrow(
    "test error"
  );
});
