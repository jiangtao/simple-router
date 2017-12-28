/**
 * 1. hash模式
 * 2. history模式
 * 3. abstract模式
 */

class Router {
  constructor(opts) {
    this._mode = opts.mode || 'history'
    this._first = ''
    this._routes = {}
    this._route = null
  }

  route(path,render) {
    if (this._first.length == 0) {
      this._first = path
    }
    this._routes[path] = render
  }

  render() {
    var path,query,params

    if (this._mode == 'hash') {
      path = location.hash.slice(1) || this._first
    } else if (this._mode === 'history') {
      path = location.pathname  === '/' ? this._first : location.pathname
    }
    if (this._routes[path] && typeof this._routes[path] === 'function') {
      query = getQuery(location.url)
      params = getParams(location.url)
      this._route = {
        path: path,
        query: query,
        params: params
      }
      this._routes[path](this._route)
    }
  }

  apply() {
    window.addEventListener('load',this.render.bind(this))
    if(this._mode === 'history') {
    	window.addEventListener('popstate', (e) => {
    		this.render()
	    })
    	
      var linkTags = document.querySelectorAll('a')
      for(let i = 0, link, len = linkTags.length; i < len; i++){
        link = linkTags[i]
        link.addEventListener('click', (e) => {
					history.pushState({}, '', link.href)
	        this.render()
        	e.preventDefault()
        })
      }
    }
    if (this._mode === 'hash') {
      window.addEventListener('hashchange',this.render.bind(this))
    }
  }

  go(n) {
		history.go(n)
  }

  push(route) {
    var path
    if (typeof route === 'object') {
      path = route.path
    } else if (typeof route === 'string') {
      path = route
    } else {
      path = '*'
    }

    if (typeof this._routes[path].render === 'function') {
      this._routes[path].render.call(this,this._routes[path])
      this._route = this._routes[path]
    }
  }
}
// TODO
function getQuery(url) {
  return {}
}
// TODO
function getParams(url) {
  return {}
}

window.Router = Router