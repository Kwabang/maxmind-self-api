import * as maxmind from "maxmind";
import isIP from "./src/isIP.js";
import express from "express";
const app = express();

let asn_db;
let country_db;
let city_db;

const maxmindDbLocation = {
  asn: "./database/GeoLite2-ASN.mmdb",
  country: "./database/GeoLite2-Country.mmdb",
  city: "./database/GeoLite2-City.mmdb",
};

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Maxmind API",
  });
});

app.get("/asn/:query_ip", (req, res) => {
  let query_ip = req.params.query_ip;
  if (isIP(query_ip)) {
    const data = asn_db.get(query_ip);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(422).send("Maxmind doesn't have any information for that IP.");
    }
  } else {
    res.status(400).json({
      error: "Not a valid IP.",
    });
  }
});

app.get("/country/:query_ip", (req, res) => {
  let query_ip = req.params.query_ip;
  if (isIP(query_ip)) {
    const data = country_db.get(query_ip);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(422).send("Maxmind doesn't have any information for that IP.");
    }
  } else {
    res.status(400).json({
      error: "Not a valid IP.",
    });
  }
});

app.get("/city/:query_ip", (req, res) => {
  let query_ip = req.params.query_ip;
  if (isIP(query_ip)) {
    const data = city_db.get(query_ip);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(422).send("Maxmind doesn't have any information for that IP.");
    }
  } else {
    res.status(400).json({
      error: "Not a valid IP.",
    });
  }
});

app.get("/geolocation/:query_ip", (req, res) => {
  let query_ip = req.params.query_ip;
  if (isIP(query_ip)) {
    const asn_data = asn_db.get(query_ip);
    const city_data = city_db.get(query_ip);
    if (asn_data && city_data) {
      const data = {
        ISP: asn_data.autonomous_system_organization,
        registered_country_code: city_data.registered_country?.iso_code,
        registered_country: city_data.registered_country?.names?.en,
        city: city_data.city?.names?.en,
        country_code: city_data.country?.iso_code,
        country: city_data.country?.names?.en,
        continent_code: city_data.continent?.code,
        continent: city_data.continent?.names?.en,
        location: city_data.location,
      };
      res.status(200).json(data);
    } else {
      res.status(422).send("Maxmind doesn't have any information for that IP.");
    }
  } else {
    res.status(400).json({
      error: "Not a valid IP.",
    });
  }
});

app.get("/isp", (req, res) => {
  let query_ip = req.headers["x-forwarded-for"];
  if (isIP(query_ip)) {
    const data = asn_db.get(query_ip);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(422).send("Maxmind doesn't have any information for that IP.");
    }
  } else {
    res.status(400).json({
      error: "Not a valid IP.",
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, async () => {
  try {
    asn_db = await maxmind.open(maxmindDbLocation.asn);
    country_db = await maxmind.open(maxmindDbLocation.country);
    city_db = await maxmind.open(maxmindDbLocation.city);
    console.log("API started");
  } catch (error) {
    console.error(error);
  }
});
