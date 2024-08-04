import React, { useState, useEffect, useRef } from 'react';

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

const AudioPlayer = ({ src }: { src: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef(0);
    const pauseTimeRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const loadAudio = async () => {
            audioContextRef.current = new (window.AudioContext)();
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
            setDuration(audioBufferRef.current.duration);
        };

        loadAudio();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [src]);

    const playAudio = () => {
        if (audioContextRef.current && audioBufferRef.current) {
            sourceNodeRef.current = audioContextRef.current.createBufferSource();
            sourceNodeRef.current.buffer = audioBufferRef.current;
            sourceNodeRef.current.connect(audioContextRef.current.destination);

            const offset = pauseTimeRef.current || 0;
            startTimeRef.current = audioContextRef.current.currentTime - offset;
            sourceNodeRef.current.start(0, offset);
            setIsPlaying(true);
            updateCurrentTime();
        }
    };

    const pauseAudio = () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            pauseTimeRef.current = audioContextRef.current!.currentTime - startTimeRef.current;
            setIsPlaying(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    };

    const updateCurrentTime = () => {
        if (audioContextRef.current && sourceNodeRef.current) {
            const elapsedTime = audioContextRef.current.currentTime - startTimeRef.current;
            setCurrentTime(elapsedTime);
            animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = parseFloat(event.target.value);
        setCurrentTime(seekTime);
        pauseAudio();
        pauseTimeRef.current = seekTime;
        playAudio();
    };

    return (
        <div className="w-full h-fit flex flex-col justify-center items-center space-y-2">
            <Button onClick={togglePlayPause} className="w-fit">
                {isPlaying ? <Pause /> : <Play />}
            </Button>
            <div className='flex items-center justify-center w-full space-x-3'>
                <SkipBack className='h-8 w-8'/>
                <Input type="range" min="0" max={duration} step="0.1" value={currentTime} onChange={handleSeek} className=" w-5/6 " />
                <SkipForward className='h-8 w-8'/>
            </div>
        </div>
    );
};

export default AudioPlayer;
