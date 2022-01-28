function CfgReaderFetch(filename) {
  return fetch(filename, { cache: 'no-store' })
    .then(response => response.status === 200? response.text() : '');
}

module.exports = CfgReaderFetch;
