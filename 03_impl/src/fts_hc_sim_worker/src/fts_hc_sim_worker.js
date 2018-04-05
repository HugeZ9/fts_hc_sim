const walk = require('walk');
const path = require('path');
const can = require('socketcan');

var can_channels = {};
var seqs = {};

exports.initialize = () => {

};
exports.finalize = () => {
    // TODO close all socket
    // TODO dispose all seqs
}
exports.start = (seq_root_path, seq_id, can_channel) => {
    return new Promise ((resolve, reject) => {
        try{
            var channel = null;
            if(can_channels[can_channel] === undefined || can_channels[can_channel] === null){
                channel = can.createRawChannel(can_channel, true);
            } else {
                channel = can_channels[can_channel];
            }
            if(channel === null || channel === undefined) {
                reject("error! Can not create network interface");
            } else {
                var seq_path = path.resolve(seq_root_path, seq_id);
                var seq_req = require(seq_path);
                if(seq_req === null || seq_req === undefined) {
                    reject("not_found");
                } else {
                    // create seq object
                    seq = (seq_req)(channel);
                    // add seq value to seqs with seq_path key
                    seqs[seq_path] = seq;
                    // start this sequence
                    seq.start();
                    //resolve!!!
                    resolve("OK");
                }
            }
        }catch (err){
            reject("error" + err);
        }
    });
}
exports.stop = (seq_root_path, seq_id, can_channel) => {
    return new Promise( (resolve, reject) => {
        var seq_path = path.resolve(seq_root_path, seq_id);
        var seq = seqs[seq_path];
        if(seq !== null && seq !== undefined) {
            seq.stop();
            seqs[seq_path] = null;
            resolve("OK");
        } else {
            reject("not_found");
        }
    });
}