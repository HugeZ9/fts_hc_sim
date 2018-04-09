const m_seq_name = 'seq0004';
var Struct = require('struct');
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
/*
*
*
*   utilities (delay, ...) implement
*/
function delay(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
}

/*
*
*
*   sequence implement
*/
function seq_start(me) {
console.log("[START] ==>");
	var startMsg = Struct()
		.word8('cmd_id')
	startMsg.allocate();
    var proxy = startMsg.fields;
    proxy.cmd_id = 0x03;
    me.socket !== null && me.socket.send({id: 0x00, 
                        length: startMsg.buffer().length, 
                        data: startMsg.buffer()
                    });
    return new Promise((resolve, reject) => {
        resolve(me);
    });
}

function seq_req(me) {
	console.log("[REQ] ==>");
    var reqMsg = Struct()
		.word8('cmd_id')
		.word8('square_id')
		.word16Ule('urgent_tick')
		.word16Ule('play_tick');
	reqMsg.allocate();
    var proxy = reqMsg.fields;
    proxy.cmd_id = 0x05;
    proxy.square_id = 0x01;
	proxy.urgent_tick = 0x1F;
	proxy.play_tick = 0x0A;
    me.socket !== null && me.socket.send({id: 0x00, 
                        length: reqMsg.buffer().length, 
                        data: reqMsg.buffer()
                    });
    return new Promise((resolve, reject) => {
        resolve(me);
    });
}

function seq_wait(me) {
    console.log("[WAIT] ==> " + me);
    // declare event handler
    return new Promise ((resolve) => {
        me.socket.addListener('onMessage', (msg) => {
            console.log("Receive message: [" + msg.data.toString('hex') + ']');
		resolve(me);
        });
    });
}
function seq_stop(me) {
    console.log("[STOP] ==> " + me);
    return new Promise((resolve, reject) => {
        resolve(me);
    });
}

/*
*
*    thisSeq implement
*
*/
function thisSeq(socket) {
    this.socket = socket;
    //this.socket.addListener("onMessage", this.recv_msg);
    this.promise = new Promise ( (resolve, reject) => {
        return resolve(this);
    });
}
thisSeq.prototype.whoami = function() {
    return m_seq_name;
};
thisSeq.prototype.start = function(cb) {
    console.log(m_seq_name + ' start!');
    this.socket.start();
    // setting for callback
    this.promise
        .then(seq_start)
	.then(seq_req)
        .then(seq_wait)
        .then(seq_stop);
};

thisSeq.prototype.recv_msg = (msg) => {
    console.log("Receive message: [" + msg.data.toString('hex') + ']');
}
thisSeq.prototype.stop = function(cb) {
    console.log(m_seq_name + ' stop!');
    delete this.promise;
    this.promise = null;
    this.socket.stop();
    this.socket = null;
};

module.exports = thisSeq;
