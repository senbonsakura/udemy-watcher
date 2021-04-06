import {useCallback, useState} from 'react'
import {emptyVideo, PathContext} from '../state/PathContext'
import {Video, VideoList} from "../components/List";
import {Course} from "../interfaces/Course";


export const usePath = ():PathContext => {

    const [videoList,setVideoList] = useState<VideoList>({videos:[]})

    const [currentVideo, setCurrentVideo] = useState<Video>(emptyVideo)
    const [currentCourse, setCourse]= useState<Course>(new Course({path:''}))
    const setCurrentCourse = useCallback((course:Course)=> {
        setCourse(course)
    }, [])
    return {videoList,setVideoList, currentVideo, setCurrentVideo,currentCourse, setCurrentCourse}
}
