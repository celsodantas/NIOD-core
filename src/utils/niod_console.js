exports.log = message => {
  //TODO: check config first + log to file
  console.info(`LOG: ${message}`);
};

exports.logObject = (object, message) => {
  this.log(message);
  console.info(object);
};

exports.logObject = object => {
  console.info(object);
};

exports.error = message => {
  console.error(`ERROR: ${message}`);
};
