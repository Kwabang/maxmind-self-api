const maxmind = require('maxmind')

const asn = (query_ip) => {
	return new Promise((resolve, reject) => {
		maxmind.open('./database/GeoLite2-ASN.mmdb').then((lookup) => {
			resolve(lookup.get(query_ip))
		}).catch((err) => {
			reject(err)
		})
	})
}

const country = (query_ip) => {
	return new Promise((resolve, reject) => {
		maxmind.open('./database/GeoLite2-Country.mmdb').then((lookup) => {
			resolve(lookup.get(query_ip))
		}).catch((err) => {
			reject(err)
		})
	})
}

const city = (query_ip) => {
	return new Promise((resolve, reject) => {
		maxmind.open('./database/GeoLite2-City.mmdb').then((lookup) => {
			resolve(lookup.get(query_ip))
		}).catch((err) => {
			reject(err)
		})
	})
}

const geolocation = (query_ip) => {
	return new Promise(async (resolve, reject) => {
		let asn_data
		let city_asn
		try {
			asn_data = (await maxmind.open('./database/GeoLite2-ASN.mmdb')).get(query_ip)
			city_asn = (await maxmind.open('./database/GeoLite2-City.mmdb')).get(query_ip)
		} catch (err) {
			reject(err)
		}
		let response
		if (city_asn.city) {
			response = {
				"ISP": asn_data.autonomous_system_organization,
				"registered_country_code": city_asn.registered_country.iso_code,
				"registered_country": city_asn.registered_country.names.en,
				"city": city_asn.city.names.en,
				"country_code": city_asn.country.iso_code,
				"country": city_asn.country.names.en,
				"continent_code": city_asn.continent.code,
				"continent": city_asn.continent.names.en,
				"location": city_asn.location
			}
		} else {
			response = {
				"ISP": asn_data.autonomous_system_organization,
				"registered_country_code": city_asn.registered_country.iso_code,
				"registered_country": city_asn.registered_country.names.en,
				"country_code": city_asn.country.iso_code,
				"country": city_asn.country.names.en,
				"continent_code": city_asn.continent.code,
				"continent": city_asn.continent.names.en,
				"location": city_asn.location
			}
		}
		resolve(response)
	})
}

exports.asn = asn
exports.country = country
exports.city = city
exports.geolocation = geolocation