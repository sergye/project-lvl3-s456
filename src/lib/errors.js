const showError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'ERROR 400: The request URL is invalid';
      case 403:
        return 'ERROR 403: Connection refused by server';
      case 404:
        return 'ERROR 404: Resource not found by url';
      default:
        return error.message;
    }
  }
  return error.message;
};

export default showError;
