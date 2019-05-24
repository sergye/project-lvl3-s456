const showError = (url, error) => {
  const status = {
    403: `Unable to download ${url}\nERROR 403: Connection refused by server`,
    404: `Unable to download ${url}\nERROR 404: Resource not found by url`,
    503: `Unable to download ${url}\nERROR 503: Service Temporarily Unavailable`,
  };
  if (error.response) {
    return status[error.response.status];
  }
  return `Unable to download ${url}\n${error.message}`;
};

export default showError;
