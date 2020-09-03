import React, {useEffect, useState} from 'react';
import playButton from "../play.svg";

type PlayNextProps = {
    setEnded: (end:boolean)=>void,
    onFinish: () => void
}

const PlayNext = ({setEnded, onFinish}:PlayNextProps) => {
    const [timeLeft,setTimeLeft] = useState(3);

    useEffect(() => {
        const timer = setTimeout(()=> {
            setTimeLeft(timeLeft -1)
            if (timeLeft===0){
                setEnded(false)
                onFinish()
            }

        },1000)

        return ()=> clearTimeout(timer)
    },[timeLeft])

    return (
        <div className={`video-player--center-button active}`}>
            <button onClick={onFinish}>
                <img height="96" width="96"
                     alt="Play video"
                     tabIndex={0} className=""
                     src={playButton}/>
                <h2 style={{left:'50%',top:'50%'}}>{timeLeft}</h2>
            </button>
        </div>
    );
};

export default PlayNext;
