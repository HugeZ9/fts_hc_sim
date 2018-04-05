const m_seq_name = 'seq0001';
let m_net_if;
exports.start = (cb) => {
	console.log(m_seq_name + ' start!');
}
exports.stop = (cb) => {
	console.log(m_seq_name + ' stop!');
}

module.exports = (net_if) => {
	m_net_if = net_if;
};