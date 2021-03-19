import React from 'react';

type CancelNextProps = {
    onCancel: ()=>void,

}

const CancelNext = ({onCancel}:CancelNextProps) => {
    return (
        <button className="video-player--cancel-button" onClick={onCancel}>
            Cancel
        </button>
    );
};

export default CancelNext;
