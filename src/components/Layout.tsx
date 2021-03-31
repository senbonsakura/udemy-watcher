import React, {useCallback, useContext, useEffect, useState} from 'react';
import Player from "./Player";
import List, {Video, VideoList} from "./List";
import styles from './Layout.module.css'
import {pathContext} from "../state/PathContext";

const Layout = () => {
    const {path} = useContext(pathContext)
    const [video, setVideo] = useState<Video>({file: "", subtitle: "", name: "", duration:0});
    const [time, setTime] = useState<number>(0)
    const [videoList, setVideoList] = useState<VideoList>({videos: []})

    useEffect(() => {
        fetch(`/api?path=${path}`)
            .then(response => response.json())
            .then(resVideoList => {
                    setVideoList(resVideoList)
                }
            )

    }, [path])
    const onSetCurrentVideo = useCallback((video:Video) => {
        video["nextVideo"] = getNextVideo(videoList, video)
        video["isActive"] = true
        setVideo(video)
    },[videoList])

    useEffect(() => {
        const currentTime = parseFloat(localStorage.getItem('currentTime') || "0")

        const currentFile = localStorage.getItem('currentFile') || ""
        for (let videoCategory of videoList.videos) {
            const currentVideoItem = (videoCategory.videos.find(videoItem => videoItem.file === currentFile))

            if (currentVideoItem) {
                onSetCurrentVideo(currentVideoItem)
                setTime(currentTime)
            }
        }
    }, [onSetCurrentVideo, videoList])
    const onSelectVideo = (selectedVideo:Video) => {
        video["isActive"] = false
        onSetCurrentVideo(selectedVideo)
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
        return {name:"Finished",file:"",subtitle:"",duration:0}
    }
    const onFinish = ():void => {
        onSelectVideo(getNextVideo(videoList,video))
    }
    return (
        path?

            <div className={styles.parent}>


                <Player {...video} time={time} onFinish={onFinish}/>

                <List videos={videoList} onSelectVideo={onSelectVideo} activeVideo={video}/>
            </div>
        :<></>
    );
};

export default Layout;
