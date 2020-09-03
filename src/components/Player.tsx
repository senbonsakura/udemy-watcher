import React, {useRef, useEffect} from 'react';
// @ts-ignore
import VTTConverter from 'srt-webvtt';

type PlayerProps = {
    file: string,
    subtitle: string,
    name:string,
    time:number
}

const Player = ({file, subtitle,name,time}: PlayerProps) => {
    const videoRef:any = useRef<HTMLVideoElement>(null)
    const trackRef:any = useRef<HTMLTrackElement>(null)
    const saveFile = () => {
        window.localStorage.setItem('currentFile', file)
        window.localStorage.setItem('currentSubtitle', subtitle)
    }

    const saveTime = () => {
        window.localStorage.setItem('currentTime', videoRef.current.currentTime)
    }

    useEffect(()=> {
        window.addEventListener("beforeunload", saveTime);
        return function() {
            window.removeEventListener("beforeunload", saveTime);
        }
    }, [])

    useEffect(()=> {

        if (subtitle.endsWith("srt")) {
            fetch(subtitle)
                .then(res=>res.blob())
                .then(blob=> {
                    console.log(blob)
                    const vttConverter = new VTTConverter(blob)
                    vttConverter.getURL().then((url:string)=> {
                        console.log('url',url)
                        trackRef.current.src = url
                        videoRef.current.textTracks[0].mode = "show"
                    })
                })



        }
        file && videoRef.current.play()
        file && saveFile()
        file && saveTime()
    },[file])

    return (
        <div>
            <video id="video" controls preload="metadata" ref={videoRef} key={file}>
                <source src={`${file}${time > 0 ? `#t=${time}`:''}`} type="video/mp4"/>
                <track ref={trackRef} label="English" kind="subtitles" srcLang="en" src={subtitle} default/>
            </video>
        </div>
    );
};

export default Player;
