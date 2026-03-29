import React from "react";

interface InputGoogleProps {
    label: string;
    children: React.ReactNode;
    req?: string | React.ReactNode;
}

const InputGoogle: React.FC<InputGoogleProps> = ({ label, children, req }) => {
    return (
        <div className="coolinput">
            <label htmlFor="input" className="text">{label}<code>{req}</code></label>
            {children}
        </div>
    );
};

export default InputGoogle;
