const http = require("http");

http
  .createServer((req, res) => {
    console.log("request recieved");
    res.end("omg hiiiiiii", "utf-8");
  })
  .listen(3000);
console.log("server up yayyyyy");
