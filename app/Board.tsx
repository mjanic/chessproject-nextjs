"use client"

import { useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import useGameStore from "@/lib/store";

export default function Board(){

    type Move = { from: string, to: string, promotion? : string };

    const {playerColor, playerElo, game, setGame, setLichessMoves, 
        engineData, setEngineData, setGameRunning, gameRunning} 
        = useGameStore()

    const makeAMove = (move: Move | string) => {
            const gameCopy = new Chess(game.fen());
            const result = gameCopy.move(move);
            setGame(gameCopy)
            return result
    }

    const fetchLichessMoves = async (latestFen:string, playerElo:number) => {
        const fen = encodeURIComponent(latestFen);
        const elo = encodeURIComponent(playerElo);
        const url = `https://explorer.lichess.ovh/lichess?since=2020-04&ratings=${elo}&speeds=rapid&fen=${fen}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.moves && data.moves.length > 0) {
                // Extract the top 3 moves (or fewer if less are available)
                const topMoves = data.moves.slice(0, 3).map((move:any) => move.san);
                console.log('move0',data.moves[0].white + data.moves[0].draws + data.moves[0].black)
                console.log('move1',data.moves[1].white + data.moves[1].draws + data.moves[1].black)
                if ( 
                    (data.moves[0].white + data.moves[0].draws + data.moves[0].black) >
                    4 * (data.moves[1].white + data.moves[1].draws + data.moves[1].black)
                    && game.moveNumber() > 1 //ignore the first move bcs always e4 e5
                ){
                    //if a most played move is played in more then 80% of cases
                    setLichessMoves([topMoves[0]]);
                } else {
                    setLichessMoves(topMoves);
                }
            } else {
                setLichessMoves([]);
            }
        } catch (error) {
            setLichessMoves([]);
            console.error("Error fetching moves:", error);
        }
    };

    const getDataFromStockfish = (latestFen: string) => {

        const stockfishWorker = new Worker('/stockfish-worker.js');

        stockfishWorker.onmessage = (event) => {
            const output = event.data;
      
            // Process the output from Stockfish here
            if (output.includes('info depth 11')) {
              const evalMatch = output.match(/score cp (-?\d+)/);
              const mateMatch = output.match(/score mate (-?\d+)/);
              const bestMoveMatch = output.match(/ pv (\S+)/);
              const continuationMatch = output.match(/ pv (.+)/);
      
              setEngineData({
                evaluation: evalMatch ? evalMatch[1]/100 : null,
                mate: mateMatch ? mateMatch[1] : null,
                bestmove: bestMoveMatch ? bestMoveMatch[1] : '',
                continuation: continuationMatch ? continuationMatch[1] : '',
              });
            }
      
            if (output.includes('bestmove')) {
              // Terminate the worker once we get the best move
              stockfishWorker.terminate();
            }
          };
      
          // Send commands to Stockfish via the worker
          stockfishWorker.postMessage('uci'); // Initialize the engine
          setTimeout(() => {
            stockfishWorker.postMessage(`position fen ${latestFen}`); // Set the position
            console.log('position is set')
            setTimeout(() => {
              stockfishWorker.postMessage('go depth 11'); // Start the calculation with depth 11
              console.log('depth is set')
            }, 200); // Slight delay to ensure commands are processed in order
          }, 200); // Slight delay to ensure commands are processed in order
    }

    function onDrop(sourceSquare:string, targetSquare:string) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        })
      
        // illegal move
        if (move === null) return false;
        return true;
    }

    useEffect(()=>{
        if (game.isGameOver()) setGameRunning(false);
        console.log('in use effect before stockfish data fetch',game.fen())
        getDataFromStockfish(game.fen())
        setTimeout(()=>{
            if (game.turn() !== playerColor[0]) {
                console.log('move num: ', game.moveNumber())
                fetchLichessMoves(game.fen(),playerElo)
                .then(()=>{
                    const updatedLiMoves = useGameStore.getState().lichessMoves
                        if (updatedLiMoves.length > 0) {
                            console.log('lichess moves: ',updatedLiMoves)
                            const randomIndex = Math.floor(Math.random()*updatedLiMoves.length)
                            makeAMove(updatedLiMoves[randomIndex]);
                        } else {
                                const updatedEngineData = useGameStore.getState().engineData
                                    console.log('engine data in use effect if not limoves: ',updatedEngineData)
                                    if(updatedEngineData.bestmove==='') {
                                        console.log('there are no moves')
                                    } else {
                                        makeAMove(updatedEngineData.bestmove)
                                    }
                        }  
                    })
            }
        },1000)
            
    },[game])

    return (
        <div className="w-[400px] flex justify-center flex-col p-2">
            {
            (   
                engineData.evaluation !== null && engineData.evaluation >=1 ||
                engineData.evaluation !== null && engineData.evaluation <=(-1)
            ) && 
            <div>
                <p className='text-red-500'>evaluation: {engineData.evaluation} </p>
                <p>best line: {engineData.continuation}</p>
            </div>
            }
            {
                (engineData.mate !== null) &&
                <div>
                    <p className='text-red-500'>mate in: {engineData.mate} </p>
                    <p>best line: {engineData.continuation}</p>
                </div>
            }
            <Chessboard 
                position={game.fen()} 
                onPieceDrop={onDrop}
                boardOrientation={playerColor}
                arePiecesDraggable={gameRunning}
            />
        </div>
    )
}