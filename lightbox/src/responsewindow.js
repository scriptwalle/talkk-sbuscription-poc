import React from 'react';

const ResponseWindow = ({ type, data, successData }) => {
    return (
        <div className={`response-window ${type}`}>
            <h3>{type}</h3>
            {type === 'approval' ? (
                <pre>{JSON.stringify(successData, null, 2)}</pre>
            ) : (
                <pre>{data}</pre>
            )}
        </div>
    );
};

export default ResponseWindow;