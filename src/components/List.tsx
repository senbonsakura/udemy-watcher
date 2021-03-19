import React, {useCallback, useEffect, useRef, useState} from 'react';

export type Video = {
    name: string,
    file: string,
    subtitle: string
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
    activeVideo: Video
}

const List: React.FC<ListProps> = ({videos, onSelectVideo, activeVideo}) => {
    const [active, setActive] = useState<string>("")
    const handleOnClick = (video: Video) => {
        onSelectVideo(video)
        setActive(video.file)
    }
    const onSetActive = useCallback(() => {
        setActive(activeVideo.file)
    }, [activeVideo.file])

    const activeRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const scrollToActiveItem = () => {
        if (activeRef.current) {

            activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })

        }
    };

    useEffect(() => {
            onSetActive()
            scrollToActiveItem()
        },
    )
    return (
            <div className="list" ref={parentRef}>
                {videos.videos.map((category: VideoCategory, key) =>
                    <h5 key={key}>
                        {category.category}
                        <ol>{category.videos.map((video: Video, key) =>
                            <h6 key={video.name}
                                className={active === video.file ? 'active' : ''}
                                ref={active === video.file ? activeRef : null}
                            >
                                <li
                                    onClick={() => handleOnClick(video)}>{video.name}
                                </li>
                            </h6>)}
                        </ol>
                    </h5>
                )}
            </div>
    );
};

export default List;

