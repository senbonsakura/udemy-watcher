import React from 'react'
import {Video, VideoList} from "../components/List";
import {Course} from "../interfaces/Course";

export interface PathContext {

    videoList: VideoList,
    setVideoList: (videos: VideoList) => void;
    currentVideo: Video,
    setCurrentVideo: (video: Video) => void;
    currentCourse: Course;
    setCurrentCourse:(course:Course)=>void
}

export const emptyVideo = {name: "", file: "", subtitle: "", duration: 0}

export const PATH_DEFAULT_VALUE = {

    videoList: {videos: []},
    setVideoList: () => {},
    currentVideo: emptyVideo,
    setCurrentVideo: () => {},
    currentCourse: new Course({path: ''}),
    setCurrentCourse:()=> {}
}


export const pathContext = React.createContext<PathContext>(PATH_DEFAULT_VALUE)
