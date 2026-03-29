import React from "react";

const Loader = ({loading}) => {
    if (!loading) return null;
    return (
        <div className="loader-overlay">
            <div className="loader-spinner" />
        </div>
    );
};

export default Loader;
