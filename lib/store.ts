import { create } from 'zustand';

import { Chess } from "chess.js";

interface engineData {
    evaluation: number | null
    mate: number | null
    bestmove: string
    continuation: string
}

interface GameState {
    game: Chess,
    setGame: (newGame: Chess) => void,

    lichessMoves: string[],
    setLichessMoves: (newLichessMoves: string[]) => void,

    playerColor: 'white' | 'black',
    setPlayerColor: (newColor: 'white' | 'black') => void,

    engineData: engineData,
    setEngineData: (newData: engineData) => void,

    playerElo: number,
    setPlayerElo: (newElo: number) => void,

    gameRunning: boolean,
    setGameRunning: (newGameRunning: boolean) => void,

    coachDialog: string,
    setCoachDialog: (newCoachDialog: string) => void
  }
  
  const useGameStore = create<GameState>(set => ({
    game: new Chess(),
    setGame: (newGame: Chess) => set({ game: newGame }),

    lichessMoves: [],
    setLichessMoves: (newLichessMoves: string[]) => set({ lichessMoves: newLichessMoves}),

    playerColor: 'white',
    setPlayerColor: (newColor: 'white' | 'black') => set({playerColor: newColor }),

    engineData: {evaluation: 0, mate: null, bestmove: '', continuation: ''},
    setEngineData: (newData: engineData) => set({engineData: newData}),

    playerElo: 1200,
    setPlayerElo: (newElo: number) => set({playerElo: newElo}),

    gameRunning: false,
    setGameRunning: (newGameRunning: boolean) => set({gameRunning: newGameRunning}),

    coachDialog: '',
    setCoachDialog: (newCoachDialog: string) => set({coachDialog: newCoachDialog})
  }))
  
  export default useGameStore