import React, { useEffect } from 'react';
import cn from 'classnames'

const ProgressBar = ({ type, segments }) => {
    useEffect(() => {
    }, [segments])
    return (
        <div className="progress-stacked w-75 p-0 my-2">
            {segments.map(segment => (
                <div
                    key={segment.id}
                    className="progress"
                    role="progressbar"
                    aria-label={segment.label}
                    aria-valuenow={segment.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ width: `${segment.value}%` }}
                >
                    <div className={cn('progress-bar progress-bar-striped progress-bar-animated', segment.className)}></div>
                </div>
            ))}
        </div>
    );
}

export default ProgressBar;
