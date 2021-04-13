import React, {useEffect, useRef, useState} from 'react';
import styles from './List.module.css'
import ListSection from "./ListSection";
import ListOpenButton from "./ListOpenButton";

export type Video = {
    name: string,
    file: string,
    subtitle: string,
    isActive?: boolean,
    nextVideo?: Video,
    duration:number
}

export type VideoCategory = {
    category: string,
    videos: Video[]
}

export type VideoList = {
    videos: VideoCategory[]
}

interface ListProps {
    videos: VideoList,
    onSelectVideo: Function,
    activeVideo: Video,
}

const List: React.FC<ListProps> = ({videos, onSelectVideo, activeVideo}) => {
    const handleOnSelectVideo = (video: Video) => {
        onSelectVideo(video)
    }
    const [isClosed, setClosed]=useState(false)
    const handleIsClosed = () => setClosed(!isClosed)

    const activeRef = useRef<HTMLDivElement>(null);

    const scrollToActiveItem = () => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest' })
        }
    };

    useEffect(() => {
            scrollToActiveItem()
            document.title = activeVideo.name
        },
        [activeVideo])
    return (
        !isClosed  ? <div className={styles.list}>

                <h2 className={styles.list__header}>Course Content
                    <button className={styles.button} onClick={handleIsClosed}>X</button>
                </h2>

            <div className={styles.list__body}>
            {videos.videos.map((category: VideoCategory, key) => {
                let isActiveCategory = false;
                if (activeVideo.file) {
                    isActiveCategory = !!category.videos.find(video => video.file === activeVideo.file)
                }

                return <ListSection category={category} key={key} onSelectVideo={handleOnSelectVideo}
                                    activeRef={activeRef}
                                    isActiveCategory={isActiveCategory}/>

            })}
            </div>
        </div> :
            <ListOpenButton onOpen={handleIsClosed}/>
    );
};

export default List;

