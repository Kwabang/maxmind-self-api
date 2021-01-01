const query = require('./query')
const express = require('express')
const app = express()

app.use((req,res,next) => {
	console.log(`IP : ${req.headers['x-forwarded-for']} | Method : ${req.method} | Url : ${req.originalUrl}`)
	next()
})

app.get('/',(req,res) => {
	res.status(200).json({"message":"Welcome to Maxmind API"})
})

app.get('/asn/:query_ip',(req,res) => {
	let query_ip = req.params.query_ip
	query.asn(query_ip).then(data => {
		res.status(200).json(data)
	}).catch((err) => {
		res.status(500).json({'error':err})
	})
})

app.get('/country/:query_ip',(req,res) => {
	let query_ip = req.params.query_ip
	query.country(query_ip).then(data => {
		res.status(200).json(data)
	}).catch((err) => {
		res.status(500).json({'error':err})
	})
})

app.get('/city/:query_ip',(req,res) => {
	let query_ip = req.params.query_ip
	query.city(query_ip).then(data => {
		res.status(200).json(data)
	}).catch((err) => {
		res.status(500).json({'error':err})
	})
})

app.get('/geolocation/:query_ip',(req,res) => {
	let query_ip = req.params.query_ip
	query.geolocation(query_ip).then(data => {
		res.status(200).json(data)
	}).catch((err) => {
		res.status(500).json({'error':err})
	})
})

app.listen(3000, () => {
	console.log("API started")
})