import React, {RefObject} from 'react';
import styles from "./ListSectionItem.module.css";
import {Video} from "./List";

interface ListSectionItemProps {
    video: Video,
    onSelectVideo: Function,
    activeRef: RefObject<HTMLDivElement>,
    id: number

}

export const toTimeString = (seconds:number):string =>{
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);

}
const ListSectionItem = ({video, onSelectVideo, activeRef, id}: ListSectionItemProps) =>
    (
        <li key={id} onClick={() => onSelectVideo(video)}>
            <div className={`${styles.item__container} ${video.isActive ? styles.active : ''} `} ref={video.isActive ? activeRef : null}>

                    <div
                        className={styles.video}
                        >{id + 1} .{video.name}
                    </div>
                    <div className={styles.time}>{toTimeString(video.duration)}</div>
            </div>
        </li>
    )


export default ListSectionItem;
