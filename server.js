const Koa = require('koa')
const app = new Koa()
const fs = require('fs')
const static = require('ikoa-static')

app.use(async(ctx, next) => {
		if(!ctx.url.endsWith('.js')) {
			console.log(1)
			ctx.type = 'html'
			ctx.body = fs.createReadStream('./index.html')
		} else {
			await next()
		}
}).use(static({dir: process.cwd()}))
app.listen(4000, () => {
	console.log('http://localhost:4000')
})