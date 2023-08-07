const express = require("express");
// const fetch = require('node-fetch');
const pgp = require("pg-promise")();

const db = pgp("postgres://postgres:root@localhost:5432/database_name");

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/fetch-and-store", async (req, res) => {
  try {
    const response = await fetch("https://api.wazirx.com/api/v2/tickers");
    const data = await response.json();
    // console.log(data);
    const top10Data = Object.values(data).slice(0, 10);

    const insertData = top10Data.map((item) => ({
      name: item.symbol,
      last: item.last,
      buy: item.buy,
      sell: item.sell,
      volume: item.volume,
      base_unit: item.base_unit,
    }));
    // await db.any(
    //   pgp.helpers.insert(
    //     insertData,
    //     ["name", "last", "buy", "sell", "volume", "base_unit"],
    //     "tickers"
    //   )
    // );
    res.status(200).json(insertData)
    res.json({ message: "Data fetched and stored successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch and store data." });
  }
});

app.get("/top-10-tickers", async (req, res) => {
  try {
    const data = await db.any("SELECT * FROM tickers LIMIT 10");
    // res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Failed to retrieve data." });
  }
});
