const isAuthenticated = jest.fn().mockImplementation(() => {
  return {
    user_id: 1,
  };
});

module.exports = isAuthenticated;
