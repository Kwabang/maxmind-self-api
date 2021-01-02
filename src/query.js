const maxmind = require('maxmind')

const asn = (query_ip) => {
	return new Promise(async (resolve, reject) => {
		let asn_data
		try {
			asn_data = (await maxmind.open('./database/GeoLite2-ASN.mmdb')).get(query_ip)
		} catch (err) {
			reject(err)
		}
		if (asn_data === null) {
			reject("Maxmind doesn't have any information for that IP.")
			return
		}
		resolve(asn_data)
	})
}

const country = (query_ip) => {
	return new Promise(async (resolve, reject) => {
		let country_data
		try {
			country_data = (await maxmind.open('./database/GeoLite2-Country.mmdb')).get(query_ip)
		} catch (err) {
			reject(err)
		}
		if (country_data === null) {
			reject("Maxmind doesn't have any information for that IP.")
			return
		}
		resolve(country_data)
	})
}

const city = (query_ip) => {
	return new Promise(async (resolve, reject) => {
		let city_data
		try {
			city_data = (await maxmind.open('./database/GeoLite2-City.mmdb')).get(query_ip)
		} catch (err) {
			reject(err)
		}
		if (city_data === null) {
			reject("Maxmind doesn't have any information for that IP.")
			return
		}
		resolve(city_data)
	})
}

const geolocation = (query_ip) => {
	return new Promise(async (resolve, reject) => {
		let asn_data
		let city_data
		try {
			asn_data = (await maxmind.open('./database/GeoLite2-ASN.mmdb')).get(query_ip)
			city_data = (await maxmind.open('./database/GeoLite2-City.mmdb')).get(query_ip)
		} catch (err) {
			reject(err)
		}
		if (asn_data === null || city_data === null) {
			reject("Maxmind doesn't have any information for that IP.")
			return
		}
		let response = {
			"ISP": asn_data.autonomous_system_organization,
			"registered_country_code": city_data.registered_country.iso_code,
			"registered_country": city_data.registered_country.names.en,
			"city": null,
			"country_code": city_data.country.iso_code,
			"country": city_data.country.names.en,
			"continent_code": city_data.continent.code,
			"continent": city_data.continent.names.en,
			"location": city_data.location
		}
		if (city_data.city) response.city = city_data.city.names.en
		resolve(response)
	})
}

exports.asn = asn
exports.country = country
exports.city = city
exports.geolocation = geolocation