import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());

app.get(`/:ticker`, async (req, res) => {
  const ticker = req.params.ticker;
  const url =
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}.SAO&apikey=XLSA5LZF5KUUXJX3`;

  const { data } = await axios.get(url);

  if (!data["Time Series (Daily)"]) {
    return res.status(429).json({
      message: "Too Many Requests. Please try again later.",
    });
  }

  const dates = Object.keys(data["Time Series (Daily)"]);
  for (let i = dates.length; i > 7; i--) {
    let av7 = 0;

    for (let j = i; j > i - 7; j--)
      av7 += parseFloat(data["Time Series (Daily)"][dates[j - 1]]["4. close"]);

    data["Time Series (Daily)"][dates[dates.length - (i - 1)]][
      "6. average 7 days"
    ] = av7 / 7;
  }

  for (let i = dates.length; i > 30; i--) {
    let av30 = 0;

    for (let j = i; j > i - 30; j--)
      av30 += parseFloat(data["Time Series (Daily)"][dates[j - 1]]["4. close"]);

    data["Time Series (Daily)"][dates[dates.length - (i - 1)]][
      "6. average 30 days"
    ] = av30 / 30;
  }

  for (let i = dates.length; i > 60; i--) {
    let av60 = 0;

    for (let j = i; j > i - 60; j--)
      av60 += parseFloat(data["Time Series (Daily)"][dates[j - 1]]["4. close"]);

    data["Time Series (Daily)"][dates[dates.length - (i - 1)]][
      "6. average 60 days"
    ] = av60 / 60;
  }

  res.send(data);
});

app.listen(5555, () => {
  console.log("running on 5555");
});
