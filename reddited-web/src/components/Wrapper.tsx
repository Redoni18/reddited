import React, { ReactNode } from "react";

interface WrapperProps {
    children: ReactNode,
    variant?: "small" | "regular"
}

const Wrapper: React.FC<WrapperProps> = ({variant, children}) => {
    return (
        <div className={`${variant === 'regular' ? 'w-3/4' : 'w-1/2'} mx-auto`}>{children}</div>
    )
}

export default Wrapper;