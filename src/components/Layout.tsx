import React, {useEffect, useState} from 'react';
import Player from "./Player";
import List, {Video, VideoList} from "./List";

const Layout = () => {

    const [video, setVideo] = useState<Video>({file: "", subtitle: "", name: ""});
    const [time, setTime] = useState<number>(0)
    const [videoList, setVideoList] = useState<VideoList>({videos: []})

    useEffect(() => {
        fetch('/api')
            .then(response => response.json())
            .then(resVideoList => {
                    setVideoList(resVideoList)
                }
            )

    }, [])

    useEffect(() => {
        const currentTime = parseFloat(localStorage.getItem('currentTime') || "0")
        console.log("currentTime",currentTime)
        const currentFile = localStorage.getItem('currentFile') || ""
        for (let videoCategory of videoList.videos) {
            const currentVideoItem = (videoCategory.videos.find(videoItem => videoItem.file === currentFile))

            if (currentVideoItem) {
                setVideo(currentVideoItem)
                setTime(currentTime)
            }
        }
    }, [videoList])
    const onSelectVideo = (video:Video) => {
        setVideo(video)
        setTime(0)
    }
    return (
        <>
            <h3>{video.name}</h3>
            <div className="parent">
                <Player {...video} time={time}/>

                <List videos={videoList} onSelectVideo={onSelectVideo} activeVideo={video}/>
            </div>
        </>
    );
};

export default Layout;
