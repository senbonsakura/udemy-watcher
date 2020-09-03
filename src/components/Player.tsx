import React, {useCallback, useEffect, useRef, useState} from 'react';
// @ts-ignore
import VTTConverter from 'srt-webvtt';
import PlayNext from "./PlayNext";

type PlayerProps = {
    file: string,
    subtitle: string,
    name: string,
    time: number,
    onFinish: () => void
}


const Player = ({file, subtitle, name, time, onFinish}: PlayerProps) => {

    const [isEnded, setEnded] = useState(false);

    const onEnded = () => {
        setEnded(true)


    }
    const videoRef: any = useRef<HTMLVideoElement>(null)
    const trackRef: any = useRef<HTMLTrackElement>(null)
    const saveFile = useCallback(() => {
        window.localStorage.setItem('currentFile', file)
        window.localStorage.setItem('currentSubtitle', subtitle)
    }, [file, subtitle])

    const saveTime = () => {
        window.localStorage.setItem('currentTime', videoRef.current.currentTime)
    }

    useEffect(() => {
        window.addEventListener("beforeunload", saveTime);
        return function () {
            window.removeEventListener("beforeunload", saveTime);
        }
    },)

    useEffect(() => {

        if (subtitle.endsWith("srt")) {
            fetch(subtitle)
                .then(res => res.blob())
                .then(blob => {
                    const vttConverter = new VTTConverter(blob)
                    vttConverter.getURL().then((url: string) => {
                        trackRef.current.src = url
                        //videoRef.current.textTracks[0].mode = "show"
                    })
                })


        }
        //file && videoRef.current.play()
        file && saveFile()
        file && saveTime()
    }, [file, saveFile, subtitle])

    return (
        <div>
            {isEnded && <PlayNext setEnded={setEnded} onFinish={onFinish}/>}
            <video id="video" controls preload="metadata" ref={videoRef} key={file} onEnded={onEnded} autoPlay>
                <source src={`${file}${time > 0 ? `#t=${time}` : ''}`} type="video/mp4"/>
                <track ref={trackRef} label="English" kind="subtitles" srcLang="en" src={subtitle.endsWith("srt") ? undefined : subtitle} default/>
            </video>
        </div>
);
};

export default Player;
