"use client"

import useGameStore from "@/lib/store";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import Image from "next/image";

export default function Coach () {

    const {coachDialog, game, gameRunning, playerColor} = useGameStore()

    return (
        <Card>
            <CardContent>
                <div className="flex">
                    <Image
                        src="/Coach.png" // Path to the image
                        alt="Coach"
                        width={100} // Desired width in pixels
                        height={125} // Desired height in pixels
                    />
                    <div className="p-2">
                        <div>
                            <p>{coachDialog}</p>
                        </div>
                        {!gameRunning && <p>Choose your options and start new game</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 