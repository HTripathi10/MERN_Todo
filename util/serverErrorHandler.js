const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return 'An unexpected error occurred';
};

module.exports = {
  getErrorMessage
};
