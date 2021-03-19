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
    const getNextVideo =(videoList:VideoList, currentVideo:Video):Video => {
        for (let cat of videoList.videos) {
            for(let vid of cat.videos) {
                const currentCategoryIndex = videoList.videos.findIndex(currentCat=>cat.category===currentCat.category)
                if (vid.file === currentVideo.file) {
                    const currentVideoIndex = cat.videos.findIndex(item=>item.file===vid.file)
                    if (currentVideoIndex < cat.videos.length -1) {
                        return cat.videos[currentVideoIndex + 1]
                    } else {
                        return videoList.videos[currentCategoryIndex + 1].videos[0]
                }

                }
            }
        }
        return {name:"Finished",file:"",subtitle:""}
    }
    const onFinish = ():void => {
        onSelectVideo(getNextVideo(videoList,video))
    }
    return (
        <>

            <div className="parent">


                <Player {...video} time={time} onFinish={onFinish}/>

                <List videos={videoList} onSelectVideo={onSelectVideo} activeVideo={video}/>
            </div>
        </>
    );
};

export default Layout;
