const express = require("express");
const fs = require("fs");

const app = express();

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

function save() {
  fs.writeFileSync("data.json", JSON.stringify(data), "utf-8");
}

app.get("/", (req, res) => {
  res.json(data);
});

app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || data.length <= id || id < 0) {
    res.status(400).json({
      msg: "잘못된 id입니다.",
    });
    return;
  }

  res.json(data);
});

app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || data.length <= id || id < 0) {
    res.status(400).json({
      msg: "잘못된 id입니다.",
    });
    return;
  }
  data[id].deleted_at = Date.now();

  res.json(data[id]);

  save();
});

app.delete("/", (req, res) => {
  for (const memo of data) {
    if (memo.deleted_at === null) {
      memo.deleted_at = Date.now();
    }
  }

  res.json(data);

  save();
});

app.listen(3000, () => {
  console.log("클라우드 메모장 서버 시작");
});
