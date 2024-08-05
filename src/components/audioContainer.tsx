import { AudioLines } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
interface Prop{
    handleClick:()=>void;
    key:number;
    style:string;
}
function AudioContainer(props:Prop) {
    return (
        <Button className={`flex bg-green-700 justify-start h-fit space-x-3 ${props.style}`} onClick={props.handleClick} key={props.key}>
            <AudioLines className='h-[70%] w-auto'/>
            <div className="flex flex-col justify-start">
                <h1 className="text-xl font-medium">Audio {props.key+1}</h1>
                <p className='w-fit text-sm'>21 June 2024</p>
            </div>
        </Button>
    )
}

export default AudioContainer
