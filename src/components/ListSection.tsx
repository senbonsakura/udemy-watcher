import React, {RefObject, useEffect, useState} from 'react';
import {Video, VideoCategory} from "./List";
import styles from './ListSection.module.css'

interface ListSecionProps {
    category: VideoCategory,
    onSelectVideo: Function,
    activeRef: RefObject<HTMLDivElement>,
    isActiveCategory: boolean
}

const ListSection = ({category, onSelectVideo, activeRef, isActiveCategory}: ListSecionProps) => {
    const [isExpanded, setExpanded] = useState(false)

    const onExpand = () => {
        setExpanded(!isExpanded)

    }
    useEffect(()=> {
        isActiveCategory && setExpanded(true)
    },[isActiveCategory])

    return (
        <div className={styles.section__container}>

            <div className={styles.section__header}>

                <span>{category.category}</span>
                <button onClick={onExpand}><i className={`${styles.arrow} ${isExpanded ? styles.down : styles.right}`}/></button>
            </div>
            <div className={`${styles.section__body} ${isExpanded ? styles.expanded : ''}`}>
                <ul>
                    <div>{category.videos.map((video: Video, key) =>

                        <li key={video.name}>
                            <div
                                className={video.isActive ? styles.active : ''}
                                ref={video.isActive ? activeRef : null}
                            >
                                <div className={styles.video}
                                     onClick={() => onSelectVideo(video)}>{key + 1} .{video.name}
                                </div>
                            </div>
                        </li>)}
                    </div>
                </ul>
            </div>

        </div>
    );
};

export default ListSection;
