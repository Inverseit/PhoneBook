const { resolver } = require("./resolver");

jest.mock("./DALcontact.js", () => require("./__mocks__/DALcontact"));

jest.mock("../../../midlewares/isAuthenticated", () =>
  require("../../../midlewares/__mocks__/isAuthenticated")
);
const isAuthenticated = require("../../../midlewares/isAuthenticated");

const user = { user_id: 1, email: "test_email", password: "test_password" };
const context = {
  token: "test_token",
  db: "test_db",
};

const contact = {
  user_id: 1,
  contact_id: 1,
  name: "test_name",
  number: "test_number",
};

describe("getAllContacts", () => {
  const getAllContacts = resolver.Query.getAllContacts;

  it("should throw when not authorized", async () => {
    const { findByID: mockedFindByID } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      throw new Error("Test token error");
    });
    await expect(getAllContacts(undefined, undefined, {})).rejects.toThrow(
      "Test token error"
    );
  });

  it("should return every conact", async () => {
    const { findByID: mockedFindByID } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      return {
        user_id: 1,
      };
    });
    const res = await getAllContacts(undefined, undefined, context);
    expect(res).toEqual([
      { user_id: 1, contact_id: 1, name: "test_name", number: "test_number" },
      { user_id: 1, contact_id: 2, name: "test_name2", number: "test_number2" },
    ]);
  });

  it("should return emptry when empty", async () => {
    const { findByID: mockedFindByID } = require("./DALcontact");
    mockedFindByID.mockReturnValue({ rows: [] });
    isAuthenticated.mockImplementation(() => {
      return {
        user_id: 1,
      };
    });

    const res = await getAllContacts(undefined, undefined, context);
    expect(res).toEqual([]);
  });
});

describe("Create Contact", () => {
  const createContact = resolver.Mutation.createContact;

  it("should throw when not authorized", async () => {
    const { findByID: mockedFindByID } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      throw new Error("Test token error");
    });
    await expect(createContact(undefined, user, context)).rejects.toThrow(
      "Test token error"
    );
  });

  it("should return back contact", async () => {
    const { insertContacts: mockedInsertContacts } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      return {
        user_id: 1,
      };
    });
    const res = await createContact(undefined, user, context);
    expect(res).toEqual(contact);
  });
});

describe("Update contact", () => {
  const updateContact = resolver.Mutation.updateContact;

  it("should throw when not authorized", async () => {
    const { findByID: mockedFindByID } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      throw new Error("Test token error");
    });
    await expect(updateContact(undefined, contact, context)).rejects.toThrow(
      "Test token error"
    );
  });

  it("should return back contact", async () => {
    const { updateContacts: mockedUpdateContacts } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      return {
        user_id: 1,
      };
    });
    const res = await updateContact(undefined, contact, context);
    expect(res).toEqual({
      contact_id: 1,
      name: "test_name",
      number: "test_number",
    });
  });
});

describe("Delete contact", () => {
  const deleteContact = resolver.Mutation.deleteContact;

  it("should throw when not authorized", async () => {
    const { findByID: mockedFindByID } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      throw new Error("Test token error");
    });
    await expect(deleteContact(undefined, user, context)).rejects.toThrow(
      "Test token error"
    );
  });

  it("should return back contact", async () => {
    const {
      deleteContactByID: mockedDeleteContactByID,
    } = require("./DALcontact");
    isAuthenticated.mockImplementation(() => {
      return {
        user_id: 1,
      };
    });
    const res = await deleteContact(undefined, user, context);
    expect(res).toEqual(contact);
  });
});
