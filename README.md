# Maxmind-Self-API <img src="https://img.shields.io/static/v1?label=code&message=Node.js&color=green" alt="">

## Query
- [ASN](#ASN)
- [Country](#Country)
- [City](#City)
- [Geolocation (ASN,Country,City integrated query)](#Geolocation)

### ASN
### Requests
```http
GET /asn/<Query_IP>
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Query_IP` | `string` | IP for query |


### Country
### Requests
```http
GET /country/<Query_IP>
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Query_IP` | `string` | IP for query |

### City
### Requests
```http
GET /city/<Query_IP>
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Query_IP` | `string` | IP for query |

### Geolocation
### Requests
```http
GET /geolocation/<Query_IP>
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Query_IP` | `string` | IP for query |

### Status Codes
| Status Code | Description |
| :--- | :--- |
| 200 | information exists in Maxmind DB |
| 404 | Non-existent path |
| 422 | No information exists in Maxmind DB |

### How to download database
https://dev.maxmind.com/geoip/geoip2/geolite2/#Access

### Caching
This logic cleans the query cache at 00:00 every day.
