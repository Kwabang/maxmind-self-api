# MaxMind GeoIP API <img src="https://img.shields.io/static/v1?label=code&message=NestJS&color=green" alt="">

NestJS 기반 MaxMind GeoIP API입니다. GeoLite2 데이터베이스를 **30분마다 자동으로 다운로드**합니다.

## 설치

```bash
npm install
```

## 실행

```bash
# 개발 모드 (watch)
npm run start:dev

# 프로덕션
npm run build
npm run start:prod
```

## API 엔드포인트

### ASN 조회

```http
GET /asn/:ip
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `ip`      | `string` | 조회할 IP 주소 |

### Country 조회

```http
GET /country/:ip
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `ip`      | `string` | 조회할 IP 주소 |

### City 조회

```http
GET /city/:ip
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `ip`      | `string` | 조회할 IP 주소 |

### Geolocation 조회 (통합)

```http
GET /geolocation/:ip
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `ip`      | `string` | 조회할 IP 주소 |

응답 예시:
```json
{
  "ISP": "GOOGLE",
  "registered_country_code": "US",
  "registered_country": "United States",
  "country_code": "US",
  "country": "United States",
  "continent_code": "NA",
  "continent": "North America",
  "location": {
    "accuracy_radius": 1000,
    "latitude": 37.751,
    "longitude": -97.822,
    "time_zone": "America/Chicago"
  }
}
```

### ISP (x-forwarded-for 헤더 사용)

```http
GET /isp
```

## Status Codes

| Status Code | Description                         |
| :---------- | :---------------------------------- |
| 200         | 정보 조회 성공                       |
| 400         | 유효하지 않은 IP                     |
| 422         | MaxMind DB에 정보 없음               |

## 데이터베이스 자동 업데이트

서버 시작 시 및 **30분마다** 다음 데이터베이스를 자동으로 다운로드합니다:

- GeoLite2-ASN.mmdb
- GeoLite2-City.mmdb
- GeoLite2-Country.mmdb

데이터베이스 출처: [P3TERX/GeoLite.mmdb](https://github.com/P3TERX/GeoLite.mmdb)
