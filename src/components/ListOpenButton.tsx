import React from 'react';
import styles from './ListOpenButton.module.css'

interface ListOpenButtonProps {
    onOpen:Function
}
const ListOpenButton = ({onOpen}:ListOpenButtonProps) => {
    return (
        <button className={styles.button} onClick={()=>onOpen()}>
            <i className={` ${styles.arrow} ${styles.left}`}/>
        </button>
    );
};

export default ListOpenButton;
