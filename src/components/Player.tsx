import React, {useCallback, useContext, useEffect, useState} from 'react';
import PlayNext from "./PlayNext";
import {Video} from "./List";
import styles from './Player.module.css'
import {pathContext} from "../state/PathContext";
import VideoPlayer from "./VideoPlayer";

type PlayerProps = {
    file: string,
    subtitle: string,
    name: string,
    time: number,
    onFinish: () => void,
    nextVideo?: Video
}


const Player = ({file, subtitle, time, onFinish, nextVideo}: PlayerProps) => {
    const {currentCourse} = useContext(pathContext)

    const [isEnded, setEnded] = useState(false);
    const onEnded = () => {
        setEnded(true)
    }

    const saveFile = useCallback(() => {
        currentCourse.update({currentFile:file,currentSubtitle:subtitle})
    }, [currentCourse, file, subtitle])

    useEffect(() => {
        file && saveFile()
    }, [file, saveFile])

    const src = `${file}${time > 0 ? `#t=${time}` : ''}`

    return (

        <div className={styles.player}>
            {file ?
                <VideoPlayer src={src} subtitle={subtitle} type="video/mp4" onEnded={onEnded} />
                : <div className={styles.no__video}><span>Select a File To Play</span></div>}

            {isEnded && <PlayNext setEnded={setEnded} onFinish={onFinish} nextVideo={nextVideo}/>}

        </div>
    );
}


export default Player;
