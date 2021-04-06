import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from './PathForm.module.css'
import {pathContext} from "../state/PathContext";
import {VideoList} from "./List";
import {Course, CourseInterface} from '../interfaces/Course'

export const saveCourses = (courses: CourseInterface[]): void => {
    localStorage.setItem('courses', JSON.stringify(courses))
}

export const loadCourses = (): Course[] => {

    return JSON.parse(localStorage.getItem('courses') || '[]').map((course: CourseInterface): Course => Course.findCourse(course.path))
}

const PathForm = () => {
        const [loading, setLoading] = useState(false)
        const {setVideoList, setCurrentVideo, setCurrentCourse} = useContext(pathContext)

        const onSetVideoList = useCallback((videoList: VideoList): void => {
            setVideoList(videoList)
            const firstVideo = videoList.videos[0].videos[0]
            setCurrentVideo(firstVideo)
        }, [setCurrentVideo, setVideoList])


        const [path, setPath] = useState<string>("")
        const [courses, setCourses] = useState<Course[]>([])
        const [playPath, setPlayPath] = useState<string>("")

        const addCourse = (course: Course): void => {
            courses.push(course)
            setCourses(courses)
            saveCourses(courses)
        }

        const removeCourse = () => {
            const remainingCourses = courses.filter(crs => crs.path !== playPath)
            setCourses(remainingCourses)
            setPlayPath(remainingCourses[0].path)
            saveCourses(remainingCourses)
            if (playPath === path) {
                localStorage.removeItem('currentPath')
            }
        }

        const [error, setError] = useState()
        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setPath(e.target.value)
        const handleOnCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setPlayPath(e.target.value || '')
        }

        const getVideoList = useCallback((path: string): void => {
            setLoading(true)
            fetch(`/api?path=${path}`)
                .then(response => response.json())
                .then((resVideoList: VideoList) => {
                        onSetVideoList(resVideoList)
                        setLoading(false)
                    }
                )
        }, [onSetVideoList])

        const handleOnPlay = () => {
            const course = Course.findCourse(playPath)
            setCurrentCourse(course)
            getVideoList(playPath)
            localStorage.setItem('currentPath', playPath)

        }
        const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            setLoading(true)
            fetch(`/api?path=${path}`)
                .then(response => {
                    if (!response.ok) {
                        response.text().then(error => setError(error))
                    } else {
                        const course = new Course({path})
                        addCourse(course)
                        setPath("")
                    }
                    setLoading(false)
                })
        }

        useEffect(() => {
            const courses = loadCourses()
            setCourses(courses)
        }, [])

        useEffect(() => {

            const currentPath = localStorage.getItem('currentPath')
            if (currentPath) {
                const currentCourse = courses.find(course => course.path === currentPath)
                currentCourse && setCurrentCourse(currentCourse)
                getVideoList(currentPath)
            }

        }, [courses, getVideoList, setCurrentCourse])


        return (
            <div className={styles.form}>
                <form onSubmit={handleOnSubmit}>
                    <label>
                        Enter Course Directory
                        <input value={path} type="text" onChange={handleOnChange}
                               placeholder="e.g E:\Downloads\Nextjs React - The Complete Guide"/>
                    </label>
                    <span className={styles.error}>{error}</span>
                    <input className={styles.button} type="submit" value="Submit" disabled={loading || !path}/>

                </form>

                <div>
                    <label>
                        Select Course
                        <select onChange={handleOnCourseChange}>
                            <option></option>
                            {courses.map((course, i) => <option key={i} value={course.path}>{course.path}</option>)}
                        </select>
                    </label>
                    <div className={styles.button__container}>
                        <button disabled={loading || !playPath} type="button"
                                className={`${styles.button} ${styles.delete}`}
                                onClick={removeCourse}>Delete
                        </button>
                        <button disabled={loading || !playPath} type={"button"}
                                className={`${styles.button} ${styles.play}`}
                                onClick={handleOnPlay}>Play
                        </button>
                    </div>
                </div>
            </div>
        );
    }
;

export default PathForm;
