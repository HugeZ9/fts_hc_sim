const m_seq_name = 'seq0001';
let m_net_if;
function thisSeq(socket) {
    this.socket = socket;
}
thisSeq.prototype.start = function(cb) {
    console.log(m_seq_name + ' start!');
};
thisSeq.prototype.stop = function(cb) {
    console.log(m_seq_name + ' stop!');
};

module.exports = (socket) => {
    return new thisSeq(socket);
}