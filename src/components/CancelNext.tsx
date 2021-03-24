import React from 'react';
import styles from './CancelNext.module.css'

type CancelNextProps = {
    onCancel: ()=>void,

}

const CancelNext = ({onCancel}:CancelNextProps) => {
    return (
        <button className={styles.cancel_button} onClick={onCancel}>
            Cancel
        </button>
    );
};

export default CancelNext;
