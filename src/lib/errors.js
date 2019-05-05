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
  } else if (error.code) {
    switch (error.code) {
      case 'ENOTFOUND':
        return 'ENOTFOUND: Unable to connect to given URL';
      case 'ECONNREFUSED':
        return 'ECONNREFUSED: Connection refused by server';
      case 'ENOENT':
        return 'ENOENT: No such file or directory';
      default:
        return error.message;
    }
  }
  return error.message;
};

export default showError;
