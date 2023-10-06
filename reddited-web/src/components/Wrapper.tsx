import React, { ReactNode } from "react";

interface WrapperProps {
    children: ReactNode,
    variant?: "small" | "regular"
    className?: string
}

const Wrapper: React.FC<WrapperProps> = ({variant, children, className}) => {
    return (
        <div className={`${variant === 'regular' ? 'w-3/4' : 'w-1/2'} mx-auto ${className}`}>{children}</div>
    )
}

export default Wrapper;