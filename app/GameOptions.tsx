"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useGameStore from "@/lib/store";
import { Chess } from "chess.js";

export default function GameOptions() {

    const {setGame, setPlayerColor, setPlayerElo, setGameRunning} = useGameStore();

    const startNewGame = (color: 'white' | 'black', elo:number) => {
        setPlayerColor(color),
        setPlayerElo(elo),
        setGame(new Chess()),
        setGameRunning(true)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const side = formData.get('side') as 'white' | 'black';
        const elo = parseInt(formData.get('elo') as string);

        if (side && elo !== undefined) {
            startNewGame(side, elo);
        }
    }

    return (
        <div className="p-2">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="side">Select side</Label>
                <Select name="side" defaultValue="white" required>
                <SelectTrigger >
                    <SelectValue placeholder="White" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="elo">Enter your ELO</Label>
                <Input
                type="number"
                id="elo"
                name="elo"
                defaultValue={1200}
                required
                />
            </div>
            <Button type="submit">Start new game</Button>
            </form>
        </div>
    )
}