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

    const videoRef = useRef<HTMLVideoElement>(null)
    const trackRef = useRef<HTMLTrackElement>(null)
    const saveFile = useCallback(() => {
        window.localStorage.setItem('currentFile', file)
        window.localStorage.setItem('currentSubtitle', subtitle)
    }, [file, subtitle])

    const saveTime = () => {
        if (videoRef && videoRef.current) {
            window.localStorage.setItem('currentTime', videoRef.current.currentTime.toString())
        }
    }

    useEffect(() => {
        window.addEventListener("beforeunload", saveTime);
        return function () {
            window.removeEventListener("beforeunload", saveTime);
        }
    },)

    interface TextTrackCueWithLine extends TextTrackCue {
        line: number
    }

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
                console.log("is ready?",track)

            }
        }
        if (trackRef && trackRef.current) {
            trackRef.current.addEventListener("load", onTrackLoaded)
        }
        //file && videoRef.current.play()
        file && saveFile()
        file && saveTime()
    }, [file, saveFile, subtitle])

    return (
        <div>
            {isEnded && <PlayNext setEnded={setEnded} onFinish={onFinish}/>}
            <video id="video" controls preload="metadata" ref={videoRef} key={file} onEnded={onEnded} autoPlay
                   width={'100%'}>
                <source src={`${file}${time > 0 ? `#t=${time}` : ''}`} type="video/mp4"/>
                <track ref={trackRef} label="English" kind="subtitles" srcLang="en"
                       src={subtitle.endsWith("srt") ? undefined : subtitle} default/>
            </video>
        </div>
    );
};

export default Player;
