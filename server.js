const Koa = require('koa')
const app = new Koa()
const fs = require('fs')
const static = require('ikoa-static')

app.use(async(ctx, next) => {
	if(process.env.RUN_ENV === 'history') {
		if(!ctx.url.endsWith('.js')) {
			ctx.type = 'html'
			ctx.body = fs.createReadStream('./history.html')
		} else {
			await next()
		}
	} else {
		await next()
	}
}).use(static({dir: process.cwd()}))
app.listen(4000, () => {
	console.log('http://localhost:4000')
})