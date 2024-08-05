importScripts('/stockfish-nnue-16-single.js');

const stockfish = Stockfish()

onmessage = function (e) {
    stockfish.postMessage(e.data);
};
  
stockfish.onmessage = function (e) {
    postMessage(e.data);
};