const walk = require('walk');
const path = require('path');

let cur_seq;
exports.start = (seq_root_path, seq_id) => {
    return new Promise ((resolve, reject) => {
        try{
            cur_seq = require(path.resolve(seq_root_path, seq_id));
            if(cur_seq === null) {
                reject("not_found");
            } else {
                cur_seq.start();
                resolve("OK");
            }
        }catch (err){
            reject("not_found");
        }
    });
}
exports.stop = () => {
    return new Promise( (resolve, reject) => {
        if(cur_seq !== null && cur_seq !== undefined) {
            cur_seq.stop();
            resolve("OK");
        } else {
            reject("not_found");
        }
    });
}