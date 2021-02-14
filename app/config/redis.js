let redis = require("redis"),
  client = redis.createClient();

client.on("error", (error) => {
  console.log(error);
});

module.exports = client;
