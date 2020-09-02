import React, {useRef, useEffect} from 'react';

type PlayerProps = {
    file: string,
    subtitle: string,
    name:string,
    time:number
}

const Player = ({file, subtitle,name,time}: PlayerProps) => {
    const playerRef:any = useRef<HTMLVideoElement>(null)
    const saveFile = () => {
        window.localStorage.setItem('currentFile', file)
        window.localStorage.setItem('currentSubtitle', subtitle)
    }

    const saveTime = () => {
        window.localStorage.setItem('currentTime', playerRef.current.currentTime)
    }

    useEffect(()=> {
        window.addEventListener("beforeunload", saveTime);
        return function() {
            window.removeEventListener("beforeunload", saveTime);
        }
    }, [])

    useEffect(()=> {
        file && playerRef.current.play()
        file && saveFile()
        file && saveTime()
    },[file])

    return (
        <div>
            <video id="video" controls preload="metadata" ref={playerRef} key={file}>
                <source src={`${file}${time > 0 ? `#t=${time}`:''}`} type="video/mp4"/>
                <track label="English" kind="subtitles" srcLang="en" src={subtitle} default/>
            </video>
        </div>
    );
};

export default Player;
