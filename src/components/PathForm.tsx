import React, {useContext, useEffect, useState} from 'react';
import styles from './PathForm.module.css'
import {pathContext} from "../state/PathContext";

const PathForm = () => {
    const {setCurrentPath} = useContext(pathContext)
    const saveCourses = ():void => {
        localStorage.setItem('courses', JSON.stringify(courses))
    }
    const loadCourses = ():void => {
        const courses = JSON.parse(localStorage.getItem('courses') || "[]")
        setCourses(courses)
    }
    const [path, setPath] = useState<string>("")
    const [courses, setCourses] = useState<string[]>([])
    const [playPath, setPlayPath] = useState<string>("")

    const addCoursePath = (course: string): void => {
        courses.push(course)
        setCourses(courses)
        saveCourses()
    }
    const removeCoursePath = () => {
        const remainingCourses = courses.filter(crs => crs !== playPath)
        setCourses(remainingCourses)
        setPlayPath(remainingCourses[0])
        saveCourses()
    }
    const [error, setError] = useState()
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setPath(e.target.value)
    const handleOnCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlayPath(e.target.value || '')
    }
    const handleOnPlay = () => {
        setCurrentPath(playPath)
    }
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        fetch(`/api?path=${path}`)
            .then(response => {
                if (!response.ok) {
                    response.text().then(error => setError(error))
                } else {
                    addCoursePath(path)
                    setPath("")
                }
            })
    }

    useEffect(()=> {
        loadCourses()
        const currentPath = localStorage.getItem('currentPath')
        currentPath && setCurrentPath(currentPath)

    },[setCurrentPath])
    return (
        <div className={styles.form}>
            <form onSubmit={handleOnSubmit}>
                <label>
                    Enter Course Directory
                    <input value={path} type="text" onChange={handleOnChange}
                           placeholder="e.g E:\Downloads\Nextjs React - The Complete Guide"/>
                </label>
                <span className={styles.error}>{error}</span>
                <input className={styles.button} type="submit" value="Submit" disabled={!path}/>

            </form>

            <div>
                <label>
                    Select Course
                    <select onChange={handleOnCourseChange}>
                        <option></option>
                        {courses.map((course, i) => <option key={i} value={course}>{course}</option>)}
                    </select>
                </label>
                <div className={styles.button__container}>
                    <button disabled={!playPath} type="button" className={`${styles.button} ${styles.delete}`}
                            onClick={removeCoursePath}>Delete
                    </button>
                    <button disabled={!playPath} type={"button"} className={`${styles.button} ${styles.play}`}
                            onClick={handleOnPlay}>Play
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PathForm;
