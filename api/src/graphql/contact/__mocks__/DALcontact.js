module.exports = {
  findByID: jest.fn().mockReturnValue([
    { user_id: 1, contact_id: 1, name: 'test_name', number: 'test_number' },
    { user_id: 1, contact_id: 2, name: 'test_name2', number: 'test_number2' },
  ]),
  insertContacts: jest
    .fn()
    .mockReturnValue([
      { user_id: 1, contact_id: 1, name: 'test_name', number: 'test_number' },
    ]),
  updateContacts: jest
    .fn()
    .mockReturnValue([
      { contact_id: 1, name: 'test_name', number: 'test_number' },
    ]),
  deleteContactByID: jest
    .fn()
    .mockReturnValue([
      { user_id: 1, contact_id: 1, name: 'test_name', number: 'test_number' },
    ]),
};
