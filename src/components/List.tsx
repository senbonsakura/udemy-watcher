import React, { useEffect, useRef, useState} from 'react';

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
    const activeRef: any = useRef();
    const scrollToRef = (ref: any) => ref.current.scrollIntoView({          behavior: 'smooth',
        block: 'center',
    })

    useEffect(() => {
        setActive(activeVideo.file)
        activeRef.current && scrollToRef(activeRef)

        },
    )
    return (
        <div className="list">
            {videos.videos.map((category: VideoCategory, key) =>
                <h5 key={key}>
                    {category.category}
                    <ol>{category.videos.map((video: Video, key) =>
                        <h6 key={video.name} className={active === video.file ? 'active' : ''}>
                            <li ref={active === video.file ? activeRef : null}
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

