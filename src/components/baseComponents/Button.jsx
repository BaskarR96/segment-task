import React from 'react';

const Button = ({
    children,
    type,
    id,
    name,
    className,
    onClick,
}) => {
    return (
        <button
            type={type}
            id={id}
            name={name}
            className={className}
            onClick={onClick ? onClick : () => null}
        >
            {children}
        </button>
    )
}

export default React.memo(Button);