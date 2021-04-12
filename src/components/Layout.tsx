import React, {useCallback, useContext, useEffect} from 'react';
import Player from "./Player";
import List, {Video, VideoList} from "./List";
import styles from './Layout.module.css'
import {pathContext} from "../state/PathContext";

const Layout = () => {
    const {videoList,setVideoList,currentVideo,setCurrentVideo, currentCourse,setCurrentCourse} = useContext(pathContext)

    const onSetCurrentVideo = useCallback((video:Video) => {
        video["nextVideo"] = getNextVideo(videoList, video)
        video["isActive"] = true
        setCurrentVideo(video)
    },[videoList, setCurrentVideo])

    useEffect(() => {

        for (let videoCategory of videoList.videos) {
            const currentVideoItem = (videoCategory.videos.find(videoItem => videoItem.file === currentCourse.currentFile))

            if (currentVideoItem) {
                onSetCurrentVideo(currentVideoItem)
            }
        }
    }, [currentCourse.currentFile, onSetCurrentVideo, videoList])
    const onSelectVideo = (selectedVideo:Video) => {
        videoList.videos.forEach(videoCategory=> {
            const video = videoCategory.videos.find(video=>video.isActive===true)
            if (video) {
                video.isActive= false
                delete video["nextVideo"]
            }


        })
        setVideoList(videoList)
        onSetCurrentVideo(selectedVideo)
        currentCourse.currentTime = 0
        setCurrentCourse(currentCourse)
    }
    const getNextVideo =(videoList:VideoList, currentVideo:Video):Video => {
        for (let cat of videoList.videos) {
            for(let vid of cat.videos) {
                const currentCategoryIndex = videoList.videos.findIndex(currentCat=>cat.category===currentCat.category)
                if (vid.file === currentVideo.file) {
                    const currentVideoIndex = cat.videos.findIndex(item=>item.file===vid.file)
                    if (currentVideoIndex < cat.videos.length -1) {
                        return cat.videos[currentVideoIndex + 1]
                    } else if(videoList.videos.length > currentCategoryIndex + 1) {
                        return videoList.videos[currentCategoryIndex + 1].videos[0]
                }

                }
            }
        }
        return {name:"Finished",file:"",subtitle:"",duration:0}
    }
    const onFinish = ():void => {
        onSelectVideo(getNextVideo(videoList,currentVideo))
    }
    return (
        videoList.videos.length > 0  ?

            <div className={styles.parent}>


                <Player {...currentVideo} time={currentCourse.currentTime} onFinish={onFinish}/>

                <List videos={videoList} onSelectVideo={onSelectVideo} activeVideo={currentVideo}/>
            </div>
        :<></>
    );
};

export default Layout;
