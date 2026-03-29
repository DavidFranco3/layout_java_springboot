import React from "react";

const InputGoogle = ({label, children,req}) => {
    return (
        <div className="coolinput">
            <label htmlFor="" for="input" className="text">{label}<code>{req}</code></label>
            {children}
        </div>
    );
};

export default InputGoogle;
