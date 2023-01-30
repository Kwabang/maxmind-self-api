const query = require('./query')
const cron = require('node-cron');
const express = require('express')
const app = express()

let cache = {
  "asn": {},
  "country": {},
  "city": {},
  "geolocation": {}
}

cron.schedule('0 0 * * *', () => {
  cache = {
    "asn": {},
    "country": {},
    "city": {},
    "geolocation": {}
  }
})

app.use((req, res, next) => {
  console.log(`IP : ${req.headers['x-forwarded-for']} | Method : ${req.method} | Url : ${req.originalUrl}`)
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({
    "message": "Welcome to Maxmind API"
  })
})

app.get('/asn/:query_ip', (req, res) => {
  let query_ip = req.params.query_ip
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query_ip)) {
    let asn_cache = cache.asn
    if (asn_cache[query_ip]) {
      res.status(200).json(asn_cache[query_ip])
    } else {
      query.asn(query_ip).then(data => {
        cache.asn[query_ip] = data
        res.status(200).json(data)
      }).catch((err) => {
        res.status(422).json({
          'error': err
        })
      })
    }
  } else {
    res.status(422).json({
      'error': 'Not a valid IP.'
    })
  }
})

app.get('/country/:query_ip', (req, res) => {
  let query_ip = req.params.query_ip
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query_ip)) {
    let country_cache = cache.country
    if (country_cache[query_ip]) {
      res.status(200).json(country_cache[query_ip])
    } else {
      query.country(query_ip).then(data => {
        cache.country[query_ip] = data
        res.status(200).json(data)
      }).catch((err) => {
        res.status(422).json({
          'error': err
        })
      })
    }
  } else {
    res.status(422).json({
      'error': 'Not a valid IP.'
    })
  }
})

app.get('/city/:query_ip', (req, res) => {
  let query_ip = req.params.query_ip
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query_ip)) {
    let city_cache = cache.city
    if (city_cache[query_ip]) {
      res.status(200).json(city_cache[query_ip])
    } else {
      query.city(query_ip).then(data => {
        cache.city[query_ip] = data
        res.status(200).json(data)
      }).catch((err) => {
        res.status(422).json({
          'error': err
        })
      })
    }
  } else {
    res.status(422).json({
      'error': 'Not a valid IP.'
    })
  }
})

app.get('/geolocation/:query_ip', (req, res) => {
  let query_ip = req.params.query_ip
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query_ip)) {
    let geolocation_cache = cache.geolocation
    if (geolocation_cache[query_ip]) {
      res.status(200).json(geolocation_cache[query_ip])
    } else {
      query.geolocation(query_ip).then(data => {
        cache.geolocation[query_ip] = data
        res.status(200).json(data)
      }).catch((err) => {
        res.status(422).json({
          'error': err
        })
      })
    }
  } else {
    res.status(422).json({
      'error': 'Not a valid IP.'
    })
  }
})

app.get('/isp', (req, res) => {
  let query_ip = req.headers['x-forwarded-for']
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query_ip)) {
    let asn_cache = cache.asn
    if (asn_cache[query_ip]) {
      res.status(200).json(asn_cache[query_ip])
    } else {
      query.asn(query_ip).then(data => {
        cache.asn[query_ip] = data
        res.status(200).json(data)
      }).catch((err) => {
        res.status(422).json({
          'error': err
        })
      })
    }
  } else {
    res.status(422).json({
      'error': 'Not a valid IP.'
    })
  }
})

app.get('*', (req, res) => {
  res.status(404).json({
    'error': 'Not Found'
  })
})

app.listen(3000, () => {
  console.log("API started")
})