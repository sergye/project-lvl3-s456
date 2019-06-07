const getErrorMessage = (url, error) => {
  const failMessage = `Unable to download ${url}`;
  const status = {
    403: `${failMessage}\nERROR 403: Connection refused by server`,
    404: `${failMessage}\nERROR 404: Resource not found by url`,
    503: `${failMessage}\nERROR 503: Service Temporarily Unavailable`,
  };
  const code = {
    ENOTFOUND: `${failMessage}\nENOTFOUND: Unable to connect to given URL`,
    ECONNREFUSED: `${failMessage}\nECONNREFUSED: Connection refused by server`,
    ENOENT: `${failMessage}\nENOENT: No such file or directory`,
    EISDIR: `${failMessage}\nEISDIR: illegal operation on a directory`,
  };
  if (error.response) {
    return status[error.response.status];
  }
  if (error.code) {
    return code[error.code];
  }
  return error.message;
};

export default getErrorMessage;
