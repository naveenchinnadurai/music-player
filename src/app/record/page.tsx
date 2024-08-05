'use client'
import AudioContainer from '@/components/audioContainer';
import AudioPlayer from '@/components/audioPlayer';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/userContext';
import { CircleUserRound, LogOut } from 'lucide-react';
import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
    const { user } = useUser();
    const [recording, setRecording] = useState(false);
    const [playAudio, setPlayAudio] = useState(false);
    const [audios, setAudios] = useState<string[]>(["helo", "hii", "workd", "helo", "hii", "workd", "helo", "hii", "workd", "helo", "hii", "workd"]);
    const [audioURL, setAudioURL] = useState<string>("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioURL(audioURL)
            audioChunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setAudios([...audios, audioURL])
        setRecording(false);
    };

    return (
        <div className="p-2 pb-0 space-y-2 bg-zinc-900 relative h-[100vh] w-full flex flex-col justify-between">
            <div className='h-[80vh] w-full flex space-x-2'>
                <div className="bg-zinc-800 p-5 rounded-xl">
                    <CircleUserRound className='text-white text-3xl' />
                    <LogOut className='text-white' />
                </div>
                <div className='bg-zinc-800 flex rounded-xl justify-center items-center h-full w-3/4'>
                    {user?.name}
                    <Button onClick={recording ? stopRecording : startRecording} className={`p-2 rounded ${recording ? 'bg-red-500' : 'bg-green-500'} text-white w-fit`}>
                        {recording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                </div>
                <div className="w-1/4 bg-zinc-800 rounded-xl p-3 flex flex-col h-full">
                    <h1 className='text-center mb-3 text-white'>Your Audios</h1>
                    <div className="overflow-auto h-full w-full p-0 space-y-2">
                        {
                            audios.length === 0 ? (
                                <h1>No Audio Found</h1>
                            ) : audios.map((e, i) => {
                                return (
                                    <AudioContainer key={i} handleClick={() => { setAudioURL(e); setPlayAudio(true) }} style='w-full' />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="bg-zinc-800 rounded-t-xl h-[20vh] p-5">
                <AudioPlayer src={audioURL} />
            </div>
        </div>
    );
};

export default VoiceRecorder;
