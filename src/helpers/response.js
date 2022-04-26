const response = {};

response.successResponseDefault = (res, status, data, total) => {
  res.status(status).json({
    data,
    total,
    err: null,
  });
};

response.successResponseforDelete = (res, status, data, msg) => {
  res.status(status).json({
    data,
    msg,
    err: null,
  });
};

response.errorResponseDefault = (res, status, err) => {
  res.status(status).json({
    err,
    data: [],
  });
};

module.exports = response;
