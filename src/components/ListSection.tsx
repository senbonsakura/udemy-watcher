import React, {RefObject, useEffect, useState} from 'react';
import {Video, VideoCategory} from "./List";
import styles from './ListSection.module.css'
import ListSectionItem, {toTimeString} from './ListSectionItem';

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
    useEffect(() => {
        isActiveCategory && setExpanded(true)
    }, [isActiveCategory])

    return (
        <div className={styles.section__container}>

            <div className={styles.section__header} onClick={onExpand}>
                <div>
                <div className={styles.section__header__title}>{category.category}</div>
                <span className={styles.expand__button} ><i
                    className={`${styles.arrow} ${isExpanded ? styles.down : styles.right}`}/></span>
                </div>
                <div className={styles.time}>{`${category.videos.length}`} videos | {toTimeString(category.videos.reduce((acc,video)=> acc + video.duration,0))}</div>


            <div className={`${styles.section__body} ${isExpanded ? styles.expanded : ''}`}>

            </div>
            </div>
            {isExpanded &&<ul className={styles.section__body}>
                <div>{category.videos.map((video: Video, key) => <ListSectionItem id={key} key={key} video={video}
                                                                                  onSelectVideo={onSelectVideo}
                                                                                  activeRef={activeRef}/>
                )}
                </div>
            </ul> }
        </div>
    );
};

export default ListSection;
