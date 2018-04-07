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
                console.log('[HIEUTC3][start] => ' + typeof can_channels[can_channel]);
            }
            if(channel === null || channel === undefined) {
                reject("error! Can not create network interface");
            } else {
                can_channels[can_channel] = channel;
                var seq_path = path.resolve(seq_root_path, seq_id);
                var seq_req = require(seq_path);
                if(seq_req === null || seq_req === undefined) {
                    reject("not_found");
                } else {
                    // create seq object
                    console.log('create seq object');
                    seq = new (seq_req)(channel);
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
            console.log('seq name: ' + seq.whoami());
            seq.stop();
            console.log('destroy sequence');
            //destroy this sequence
            delete seq;
            seqs[seq_path] = null;
            //destroy can_channel
            console.log('[HIEUTC3][stop] => ' + typeof can_channels[can_channel]);
            delete can_channels[can_channel];
            can_channels[can_channel] = null;
            resolve("OK");
        } else {
            reject("not_found");
        }
    });
}