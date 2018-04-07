const m_seq_name = 'seq0002';
var Struct = require('struct');
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;
var Msg = Struct()
            .word8('id')
            .word16Ule('msg32_2');

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
function seq1(me) {
    Msg.allocate();
    var proxy = Msg.fields;
    proxy.id = 11;
    proxy.msg32_2 = 0xAA;
    me.socket !== null && me.socket.send({id: 100, 
                        length: Msg.buffer().length, 
                        data: Msg.buffer()
                    });
    return new Promise((resolve, reject) => {
        resolve(me);
    });
}

function seq2(me) {
    console.log("SEQ2 ==> " + me);
    // declare event handler
    return new Promise ((resolve) => {
        me.socket.addListener('onMessage', (msg) => {
            resolve(me);
        });
    });
}
function seq3(me) {
    console.log("SEQ3 ==> " + me);
    Msg.allocate();
    var proxy = Msg.fields;
    proxy.id = 11;
    proxy.msg32_2 = 0xBB;
    me.socket !== null && me.socket.send({id: 100, 
                        length: Msg.buffer().length, 
                        data: Msg.buffer()
                    });
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
    this.socket.addListener("onMessage", this.recv_msg);
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
        .then(seq1)
        .then(seq2)
        .then(seq3)
        .then(seq2)
        .then(seq3);
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