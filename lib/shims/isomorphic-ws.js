// Browser build of isomorphic-ws only has a default export, but
// @midnight-ntwrk/midnight-js-indexer-public-data-provider imports `* as ws` and
// reads `ws.WebSocket`. Turbopack rejects that statically, so expose both.
const WS = globalThis.WebSocket;
export const WebSocket = WS;
export default WS;
