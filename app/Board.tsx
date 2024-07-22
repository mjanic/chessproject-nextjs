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
        console.log('your elo is: ', playerElo)
        const fen = encodeURIComponent(latestFen);
        const elo = encodeURIComponent(playerElo);
        const url = `https://explorer.lichess.ovh/lichess?since=2020-04&ratings=${elo}&speeds=rapid&fen=${fen}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.moves && data.moves.length > 0) {
                // Extract the top 3 moves (or fewer if less are available)
                const topMoves = data.moves.slice(0, 3).map((move:any) => move.san);
                setLichessMoves(topMoves);
            } else {
                setLichessMoves([]);
            }
        } catch (error) {
            console.error("Error fetching moves:", error);
        }
    };

    const fetchStockfishMoves = async (latestFen:string) => {
        const fen = encodeURIComponent(latestFen);
        const url = `https://stockfish.online/api/s/v2.php?depth=11&fen=${fen}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setEngineData({
                    evaluation: data.evaluation,
                    mate: data.mate,
                    bestmove: data.continuation.split(' ')[0],
                    continuation: data.continuation,
                })
            }
        } catch (error) {
            console.error("Error fetching moves:", error);
        }
    };

    function onDrop(sourceSquare:string, targetSquare:string) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        })
      
        // illegal move
        if (move === null) return false;
        fetchStockfishMoves(game.fen())
        return true;
    }

    useEffect(()=>{
        if (game.isGameOver()) setGameRunning(false);
        if (game.turn() !== playerColor[0]) {
            fetchLichessMoves(game.fen(),playerElo)
            .then(()=>{
                const updatedLiMoves = useGameStore.getState().lichessMoves
                    if (updatedLiMoves.length > 0) {
                        console.log('lichess moves: ',updatedLiMoves)
                        const randomIndex = Math.floor(Math.random()*updatedLiMoves.length)
                        makeAMove(updatedLiMoves[randomIndex]);
                    } else {
                        fetchStockfishMoves(game.fen())
                        .then(()=> {
                            const updatedEngineData = useGameStore.getState().engineData
                                console.log('engine data: ',updatedEngineData)
                                if(updatedEngineData.bestmove==='') {
                                    console.log('there are no moves')
                                } else {
                                    makeAMove(updatedEngineData.bestmove)
                                }
                        })
                    }  
                })
        }
    },[game])

    return (
        <div className="w-[400px] flex justify-center flex-col p-2">
            {
            ((engineData.evaluation >=1 && playerColor === 'black') || (engineData.evaluation <=(-1) && playerColor === 'white')) && 
            <div>
                <p className='text-red-500'>evaluation: {engineData.evaluation} </p>
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