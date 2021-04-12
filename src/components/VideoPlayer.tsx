import React, {SyntheticEvent, useCallback, useContext, useEffect, useRef, useState} from 'react';
import videojs, {VideoJsPlayer} from 'video.js'
// @ts-ignore
import VTTConverter from 'srt-webvtt';

import {pathContext} from "../state/PathContext";
import 'video.js/dist/video-js.css'
import './VideoPlayer.module.css'

interface VideoPlayerProps {
    src: string,
    type: string,
    subtitle: string,
    onEnded: (event: SyntheticEvent<HTMLVideoElement, Event>) => void
}

const options = {
    fill: true,
    fluid: true,
    responsive: true,
    preload: 'auto',
    controls: true,
    autoplay: true,
    playbackRates: [0.5, 1, 1.5, 2]

};

const VideoPlayer = ({src, type = 'video/mp4', subtitle, onEnded}: VideoPlayerProps) => {
    const {currentCourse} = useContext(pathContext)
    const videoRef = useRef<HTMLVideoElement>(null);
    const [player, setPlayer] = useState<VideoJsPlayer>();

    const addRemoteTrack = useCallback((subtitle: string) => {

        return player?.addRemoteTextTrack(
            {
                src: subtitle, default: true, kind: 'captions', language: 'en', label: 'English'
            }, false)

    }, [player])

    const saveTime = useCallback(() => {
        if (videoRef && videoRef.current) {
            currentCourse.update({currentTime: videoRef.current.currentTime})
        }
    }, [currentCourse])

    useEffect(() => {
        window.addEventListener("beforeunload", saveTime);
        return ()=> {
            window.removeEventListener("beforeunload", saveTime);
        }
    },[saveTime])

    useEffect(() => {
        const vjsPlayer = videojs(videoRef.current, options);
        setPlayer(vjsPlayer);
        //return () => vjsPlayer.dispose();
    }, []);

    useEffect(() => {
        if (player) {
            player.src({src, type});
        }
        return () => saveTime()
    }, [src, type, player, saveTime]);

    useEffect(() => {
        if (subtitle) {
            if (subtitle.endsWith("srt")) {
                fetch(subtitle)
                    .then(res => res.blob())
                    .then(blob => {
                        const vttConverter = new VTTConverter(blob)
                        vttConverter.getURL().then((url: string) => {
                            addRemoteTrack(url)
                        }
                        )
                    })
            } else {
                addRemoteTrack(subtitle)
            }
        }
        //return () => track && player?.removeRemoteTextTrack(track)
    }, [subtitle, player, addRemoteTrack])


    return (
        <div>
            <div data-vjs-player>
                <video ref={videoRef} className="video-js" onEnded={onEnded} width={'100%'}>

                </video>
            </div>
        </div>
    )
};

export default VideoPlayer;
