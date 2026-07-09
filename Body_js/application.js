const http = require('http');
const EventEmitter = require('events')

module.exports = class Application {
    constructor() {
        this.emitter = new EventEmitter();
        this.server = this._createServer()
        this.middlrware = []
    }

    use(middlrware) {
        this.middlrware.push(middlrware);
    }

    listen(port, callback) {
        this.server.listen(port, callback)
    }

    addRouter(router){
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach((method) => {
                this.emitter.on(this._getRouterMask(path, method), (req, res) => {
                    const handler = endpoint[method];
                    handler(req, res)
                })
            })
        })
    }
    
    
    _createServer(){
        return http.createServer((req, res) => {
            let body = "";

            req.on('data', (chunk) => {
                body += chunk;
            })

            req.on('end', () => {
                if (body) {
                    req.body = JSON.parse(body);
                }
                this.middlrware.forEach(middlrware => middlrware(req, res))
                const emitter = this.emitter.emit(this._getRouterMask(req.pathname, req.method), req, res)
                if(!emitter) {
                    res.end()
                }
                
            })
        })
    }

_getRouterMask(path, method){
    return `[${path}]:[${method}]`
}


}