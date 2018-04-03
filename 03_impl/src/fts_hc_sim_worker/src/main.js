var api_srv = require('./fts_hc_sim_worker_api_srv');
var cfg = require('./config');

api_srv.start(cfg.port, cfg.root_path);