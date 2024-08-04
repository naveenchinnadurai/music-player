'use client'
import AudioPlayer from '@/components/audioPlayer';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/userContext';
import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
    const { user } = useUser();
    const [recording, setRecording] = useState(false);
    const [playAudio, setPlayAudio] = useState(false);
    const [audios, setAudios] = useState<string[]>([]);
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
        <div className="bg-red-400 relative h-[100vh] w-full flex flex-col justify-between">
            <div className='h-full w-full flex'>
                <div className='bg-red-500 flex justify-center items-center h-full w-3/4'>
                    { user?.name }
                    <Button onClick={recording ? stopRecording : startRecording} className={`p-2 rounded ${recording ? 'bg-red-500' : 'bg-green-500'} text-white w-fit`}>
                        {recording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                </div>
                <div className="w-1/4 bg-slate-700 p-3 flex flex-col">
                    <h1 className='text-center'>Your Audios</h1>
                    {
                        audios.length === 0 ? (
                            <h1>No Audio Found</h1>
                        ) : audios.map((e, i) => {
                            return (
                                <Button key={i} onClick={() => { setAudioURL(e); setPlayAudio(true) }} className='mt-3'>Audio {i + 1}</Button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="pb-8 pt-5 bg-slate-500">
                {audioURL && (
                    <AudioPlayer src={audioURL} />
                )}
            </div>
        </div>
    );
};

export default VoiceRecorder;
