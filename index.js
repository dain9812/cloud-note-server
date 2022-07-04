const express = require("express");
const fs = require("fs");

const app = express();

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

app.listen(3000, () => {
  console.log("클라우드 메모장 서버 시작");
});
