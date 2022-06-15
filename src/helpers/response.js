const response = {};

response.successResponseDefault = (res, status, data, total) => {
  res.status(status).json({
    data,
    total,
    err: null,
  });
};
response.successResponsewihMeta = (res, status, data, total, meta) => {
  res.status(status).json({
    data,
    total,
    meta,
    err: null,
  });
};

response.successResponseWithMsg = (res, status, data, msg) => {
  res.status(status).json({
    msg,
    data,
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
