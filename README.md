
# Node.js, Express.js Microservices

### (freeCodeCamp "Introduction to the Back End Development and APIs Projects")

See https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/

Solution of the challenges is available on Heroku: https://statlertronik-microservice-prj.herokuapp.com/

## Timestamp Microservice  
https://statlertronik-microservice-prj.herokuapp.com/timestamp

A request to /api/:date? with a valid date should return a JSON object with a **unix** key that is a Unix timestamp of the input date in milliseconds (as type Number) and **utc** key that is a string of the input date in the format: Thu, 01 Jan 1970 00:00:00 GMT

A request to /api/1451001600000 should return { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }

If the input date string is invalid, the api returns an object having the structure { error : "Invalid Date" }

An empty date parameter should return the current time in a JSON object with a **unix** & **utx** keys.

## Request Header Parser Microservice  
https://statlertronik-microservice-prj.herokuapp.com/requestHeaderParser

A request to /api/whoami should return a JSON object with your IP address in the **ipaddress** key, your preferred language in the **language** key and your software in the **software** key.

## URL Shortener Microservice  
https://statlertronik-microservice-prj.herokuapp.com/URLShortenerMicroservice

![url-shortener](https://user-images.githubusercontent.com/54773918/185158931-f961edfd-0fdf-4153-8b5e-52091546dd53.png)


You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}.

When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.

If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }


