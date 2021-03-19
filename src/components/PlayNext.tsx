import React, {useEffect, useState} from 'react';
import playButton from "../play.svg";
import CancelNext from "./CancelNext";

type PlayNextProps = {
    setEnded: (end:boolean)=>void,
    onFinish: () => void
}

const PlayNext = ({setEnded, onFinish}:PlayNextProps) => {
    const [timeLeft,setTimeLeft] = useState(300);
    const [timerCancelled, setTimeCancelled] = useState(false)
    const onCancel =() => {
        setTimeCancelled(true)
    }

    useEffect(() => {
        const timer = setTimeout(()=> {
            setTimeLeft(timeLeft -1)
            if (timeLeft===0){
                setEnded(false)
                onFinish()
            }

        },1000)
        timerCancelled && clearTimeout(timer)
        return ()=> clearTimeout(timer)
    },[timeLeft, setTimeCancelled])

    return (
        <>
        <div className={`video-player--center-button active}`}>
            <button onClick={onFinish}>
                <img height="96" width="96"
                     alt="Play next video"
                     tabIndex={0} className=""
                     src={playButton}/>


            </button>
            <div className="video-player--timer-text" hidden={timerCancelled}>Next in {timeLeft}</div>
            {!timerCancelled && <CancelNext onCancel={onCancel}/>}
            </div>

        </>
    );
};

export default PlayNext;
