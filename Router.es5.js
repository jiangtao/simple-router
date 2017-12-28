/**
 * 1. hash模式
 * 2. history模式
 * 3. abstract模式
 */
var Router = /** @class */ (function () {
	function Router(opts) {
		this._mode = opts.mode || 'history';
		this._first = '';
		this._routes = {};
		this._route = null;
	}
	Router.prototype.route = function (path, render) {
		if (this._first.length == 0) {
			this._first = path;
		}
		this._routes[path] = render;
	};
	Router.prototype.render = function () {
		var path, query, params;
		if (this._mode == 'hash') {
			path = location.hash.slice(1) || this._first;
		}
		else if (this._mode === 'history') {
			path = location.pathname === '/' ? this._first : location.pathname;
		}
		console.log(path)
		if (this._routes[path] && typeof this._routes[path] === 'function') {
			query = getQuery(location.url);
			params = getParams(location.url);
			this._route = {
				path: path,
				query: query,
				params: params
			};
			this._routes[path](this._route);
		}
	};
	Router.prototype.apply = function () {
		var _this = this;
		window.addEventListener('load', this.render.bind(this));
		if (this._mode === 'history') {
			window.addEventListener('popstate', function (e) {
				_this.render();
			});
			var linkTags = document.querySelectorAll('a');
			var _loop_1 = function (i, link, len) {
				link = linkTags[i];
				link.addEventListener('click', function (e) {
					history.pushState({}, '', link.href);
					_this.render();
					e.preventDefault();
				});
				out_link_1 = link;
			};
			var out_link_1;
			for (var i = 0, link = void 0, len = linkTags.length; i < len; i++) {
				_loop_1(i, link, len);
				link = out_link_1;
			}
		}
		if (this._mode === 'hash') {
			window.addEventListener('hashchange', this.render.bind(this));
		}
	};
	Router.prototype.go = function (n) {
		history.go(n);
	};
	Router.prototype.push = function (route) {
		var path;
		if (typeof route === 'object') {
			path = route.path;
		}
		else if (typeof route === 'string') {
			path = route;
		}
		else {
			path = '*';
		}
		if (typeof this._routes[path].render === 'function') {
			this._routes[path].render.call(this, this._routes[path]);
			this._route = this._routes[path];
		}
	};
	return Router;
}());
// TODO
function getQuery(url) {
	return {};
}
// TODO
function getParams(url) {
	return {};
}
window.Router = Router;
