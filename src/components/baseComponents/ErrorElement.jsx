import React from 'react'

const ErrorElement = ({
    children,
}) => {
    return (
        <small
            type={'error'}
            className={"error mt-5 text-sm text-[#bb251a]"}
        >
            {children}
        </small>
    )
}

export default React.memo(ErrorElement);