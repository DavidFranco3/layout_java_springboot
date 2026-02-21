import React from "react";

const CardConRibbon = ({ image, ribbonText, ribbonColor = "success", title, onClick }) => {
    return (
        <div className="col-md-3 mb-4">
            <div className="position-relative cursor-pointer" onClick={onClick}>
                <img src={image} alt={title} className="img-fluid rounded shadow" />
                <div className="ribbon-wrapper ribbon-lg">
                    <div className={`p-2 ribbon bg-${ribbonColor} text-lg`}>
                        {ribbonText}
                    </div>
                </div>
                <div className="text-center mt-2 fw-bold">{title}</div>
            </div>
        </div>
    );
};

export default CardConRibbon;
