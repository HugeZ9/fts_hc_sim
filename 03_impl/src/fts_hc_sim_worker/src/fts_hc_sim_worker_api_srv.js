var restify = require('restify');
var sim_worker = require('./fts_hc_sim_worker');
var server = restify.createServer();
let m_root_path;
// server.use(restify.plugins.queryParser());
server.use(restify.plugins.queryParser({ mapParams: false }));
const map_err = x => {
    switch(x) {
        case "ok": return 200;
        case "OK": return 200;
        case 'error': return 500;
        case 'confict': return 409;
        case 'not_found': return 404;
        default: return 500;
    }
}
function resp_ping(req, res, next) {
    console.log('received a ping!');
    res.send(200, "Pong!");
    next();
}
function resp_start (req, res, next) {
    console.log('receive a request start: ' + JSON.stringify(req.query));
    sim_worker.start(m_root_path + 'seq/', req.query.seq_id, req.query.can_channel)
        .then((ret_msg) => {
            res.send(201, 'start: ' + req.query.seq_id + ' with result: ' + ret_msg)})
        .catch((err) => res.send(map_err(err), err))
        .then(next);
}
function resp_stop (req, res, next) {
    console.log('receive a request stop: ' + JSON.stringify(req.query));
    sim_worker.stop(m_root_path + 'seq/', req.query.seq_id, req.query.can_channel)
        .then((ret_msg) => {
            res.send(map_err(ret_msg), 'stop: ' + req.query.seq_id + ' with result: ' + ret_msg)})
        .catch((err) => res.send(map_err(err), err))
        .then(next);
}
server.get('/ping', resp_ping);
server.get('/request', (req, res, next) => {console.log('request!'); res.send(200, "request!")});
server.get('/request/start/', resp_start);
server.get('/request/stop/', resp_stop);
exports.start = (port, root_path) => {
    m_root_path = root_path + '//';
    server.listen(port, () => {
        console.log('%s listen at %s', server.name, server.url);
    });
}
/*EOF*/
