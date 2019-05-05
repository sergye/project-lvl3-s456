const showError = (error) => {
  const status = {
    403: 'ERROR 403: Connection refused by server',
    404: 'ERROR 404: Resource not found by url',
  };
  const code = {
    ENOTFOUND: 'ENOTFOUND: Unable to connect to given URL',
    ECONNREFUSED: 'ECONNREFUSED: Connection refused by server',
    ENOENT: 'ENOENT: No such file or directory',
  };
  if (error.response) {
    return status[error.response.status];
  }
  if (error.code) {
    return code[error.code];
  }
  return error.message;
};

export default showError;
