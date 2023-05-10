const getUnixEpochSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

module.exports = {
  getUnixEpochSeconds
}