const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

function save() {
  fs.writeFileSync("data.json", JSON.stringify(data), "utf-8");
}

app.get("/", (req, res) => {
  res.json(data.filter((d) => d.deleted_at === null));
});

app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || data.length <= id || id < 0) {
    res.status(400).json({
      msg: "잘못된 id입니다.",
    });
    return;
  }

  if (data[id].deleted_at !== null) {
    res.status(404).json({
      msg: "이미 제거된 메모입니다.",
    });
    return;
  }

  res.json(data[id]);
});

app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || data.length <= id || id < 0) {
    res.status(400).json({
      msg: "잘못된 id입니다.",
    });
    return;
  }

  if (data[id].deleted_at !== null) {
    res.status(404).json({
      msg: "이미 제거된 메모입니다.",
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

app.post("/", (req, res) => {
  const { content } = req.body;

  if (!content || content.length === 0) {
    res.status(400).json({
      msg: "content가 올바르지 않습니다.",
    });
    return;
  }

  const memo = {
    content,
    created_at: Date.now(),
    updated_at: null,
    deleted_at: null,
  };

  data.push(memo);

  res.json(memo);

  save();
});

app.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  if (!content || content.length === 0) {
    res.status(400).json({
      msg: "content가 올바르지 않습니다.",
    });
    return;
  }

  if (isNaN(id) || data.length <= id || id < 0) {
    res.status(400).json({
      msg: "잘못된 id입니다.",
    });
    return;
  }

  if (data[id].deleted_at !== null) {
    res.status(404).json({
      msg: "이미 제거된 메모입니다.",
    });
    return;
  }

  data[id].updated_at = Date.now();
  data[id].content = content;

  res.json(data[id]);

  save();
});

app.listen(3000, () => {
  console.log("클라우드 메모장 서버 시작");
});
