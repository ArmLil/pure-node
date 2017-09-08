'use strict'

const fs = require ('fs')
const http = require('http')

const getPutData = (req, toFile) => {
	let body = []
	req.on('data', (chunk) => {
		body.push(chunk)
		body = Buffer.concat(body).toString()
	});
	req.on('end', () => {
		fs.appendFile(toFile, body, (err) => {
			if (err) {
				console.error('Opps',err)
				throw err
			}
		})
	});
}

const server = http.createServer()

server.on('request', (req, res) => {
	const { method, url } = req;
	const fileCreated = fs.existsSync('2lesson/tweets.json')

	if(url == '/tweets') {
		if (!fileCreated && method == 'POST') {
			getPutData(req, '2lesson/tweets.json')
			res.end('POST request, data have been created!')
		}
		else if (fileCreated && method == 'PUT') {
			getPutData(req, '2lesson/tweets.json')
			res.end('PUT request, file has been updated!')
		}
		else if (fileCreated && method == 'GET') {
			fs.readFile('2lesson/tweets.json', 'utf8', (err, tweets) => {
				if (err) {
					console.error('Opps', err)
					throw err
				}
				res.end(tweets)
			})
		}
		else res.end('Bad Request!...Choose correct endpoint and method, please!')
	}

  else if (url == '/' && method == 'GET') res.end('Hello there!')
  else res.end('Bad Request!...Choose correct endpoint and method, please!')
});

server.listen(3000, () => {
  console.log('server listening on port', server.address().port)
})
