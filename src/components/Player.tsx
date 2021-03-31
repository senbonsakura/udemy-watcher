import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
// @ts-ignore
import VTTConverter from 'srt-webvtt';
import PlayNext from "./PlayNext";
import {Video} from "./List";
import styles from './Player.module.css'
import {pathContext} from "../state/PathContext";


type PlayerProps = {
    file: string,
    subtitle: string,
    name: string,
    time: number,
    onFinish: () => void,
    nextVideo?: Video
}


const Player = ({file, subtitle, time, onFinish, nextVideo}: PlayerProps) => {
    const {path} = useContext(pathContext)
    const [isEnded, setEnded] = useState(false);

    const onEnded = () => {
        setEnded(true)
    }

    const videoRef = useRef<HTMLVideoElement>(null)
    const trackRef = useRef<HTMLTrackElement>(null)
    const saveFile = useCallback(() => {
        localStorage.setItem('currentPath', path)
        localStorage.setItem('currentFile', file)
        localStorage.setItem('currentSubtitle', subtitle)
    }, [path, file, subtitle])

    const saveTime = () => {
        if (videoRef && videoRef.current) {
            localStorage.setItem('currentTime', videoRef.current.currentTime.toString())
        }
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
                        if (trackRef && trackRef.current) {
                            trackRef.current.src = url

                        }
                        //videoRef.current.textTracks[0].mode = "show"
                    })
                })
        }
        const onTrackLoaded = () => {
            setEnded(false)
            if (trackRef && trackRef.current) {
                const track = trackRef.current.track
                const cues = track.cues
                for (let j = 0;j < cues.length;j++) {
                    let new_cue = new VTTCue(cues[j].startTime,cues[j].endTime, cues[j].text);
                    new_cue.line = 95
                    new_cue.snapToLines = true
                    track.removeCue(cues[j])
                    track.addCue(new_cue)

                }


            }
        }
        if (trackRef && trackRef.current) {
            trackRef.current.addEventListener("load", onTrackLoaded)
        }
        //file && videoRef.current.play()
        file && saveFile()

    }, [file, saveFile, subtitle])

    return (
        <div className={styles.player}>
            <video id="video" controls preload="metadata" ref={videoRef} key={file} onEnded={onEnded} autoPlay
                   width={'100%'}>
                <source src={`${file}${time > 0 ? `#t=${time}` : ''}`} type="video/mp4"/>
                <track ref={trackRef} label="English" kind="subtitles" srcLang="en"
                       src={subtitle.endsWith("srt") ? undefined : subtitle} default/>
            </video>
            {isEnded && <PlayNext setEnded={setEnded} onFinish={onFinish} nextVideo={nextVideo}/>}

        </div>
    );
};

export default Player;
