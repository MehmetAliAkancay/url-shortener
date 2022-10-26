require("dotenv/config");
const express = require("express");
const validUrl = require("valid-url");
const Url = require("../models/Url");
const { default: ShortUniqueId } = require("short-unique-id");

const router = express.Router();

router.get("/shortener", (req, res) => {
  res.json("Get isteği başarılı.");
});

router.post("/shortener", async (req, res) => {
  const { longUrl } = req.body;
  let { urlCode } = req.body;
  const baseUrl = process.env.baseUrl;

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });
      if (url) {
        return res.status(201).json({ data: url });
      } else {
        if (urlCode === undefined) {
          const uid = new ShortUniqueId({ length: 6 });
          urlCode = uid();
        }
        let shortUrl = baseUrl + "/" + urlCode;
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });
        await url.save();
        return res.status(201).json({ data: url });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Bir hata oluştu." });
    }
  } else {
    return res.status(400).json({ message: "Geçersiz bağlatı linki." });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ message: "Url bulunamadı." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Bir hata oluştu." });
  }
});

module.exports = router;
