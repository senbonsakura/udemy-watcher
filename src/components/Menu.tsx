import React, {useContext, useState} from 'react';
import PathForm from "./PathForm";
import styles from "./Menu.module.css"
import {pathContext} from "../state/PathContext";


const Menu = () => {
    const {videoList} = useContext(pathContext)
    const [toggle,setToggle] = useState(true)
    const handleOnToggle = () => setToggle(!toggle)
    return (
        <>
        <div className={videoList.videos.length > 0 && toggle ? styles.off : styles.on}>
            <PathForm/>
        </div>
            <div className={styles.toggler}>
                <button onClick={handleOnToggle}><i className={`${styles.arrow} ${styles.down}`}/></button>
            </div>
        </>
    );
};

export default Menu;
