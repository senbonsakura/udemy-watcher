import React, {useEffect, useState} from 'react';
import playButton from "../play.svg";
import CancelNext from "./CancelNext";
import styles from './PlayNext.module.css'
import {Video} from "./List";
type PlayNextProps = {
    setEnded: (end:boolean)=>void,
    onFinish: () => void,
    nextVideo?:Video
}

const PlayNext = ({setEnded, onFinish, nextVideo}:PlayNextProps) => {
    const [timeLeft,setTimeLeft] = useState(3);
    const [timerCancelled, setTimeCancelled] = useState(false)
    const onCancel =() => {
        setTimeCancelled(true)
    }
    const onPlayNext =  () => {
        setEnded(false)
        onFinish()
    }
    useEffect(() => {
        const timer = setTimeout(()=> {
            setTimeLeft(timeLeft -1)
            if (timeLeft===0){
                onPlayNext()
            }

        },1000)
        timerCancelled && clearTimeout(timer)
        return ()=> clearTimeout(timer)
    },[timeLeft, setTimeCancelled, timerCancelled, setEnded, onFinish, onPlayNext])

     return nextVideo ? (

        <div className={styles.play_next__container}>
            <button onClick={onPlayNext}>
                <img height="96" width="96"
                     alt="Play next video"
                     tabIndex={0} className=""
                     src={playButton}/>
            </button>
            <div className={styles.timer_text} hidden={timerCancelled}>{nextVideo.name} in {timeLeft}</div>
            {!timerCancelled && <CancelNext onCancel={onCancel}/>}
            </div>

    ) :
         <h3>Congratulations, Course is Over</h3>
};

export default PlayNext;
