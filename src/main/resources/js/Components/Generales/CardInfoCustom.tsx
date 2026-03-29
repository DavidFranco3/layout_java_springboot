import React from "react";

const CardInfoCustom = ({
    number,
    title,
    secondNumber = null,
    secondTitle = null,
    bgColor,
    iconClass,
    link,
}) => {
    return (
        <div className="col">
            <div className={`small-box ${bgColor}`}>
                <div className="inner">
                    <p>{title}</p>
                    <h3>{number}</h3>

                    {/* Mostrar el segundo número y título si están disponibles */}
                    {secondNumber && secondTitle && (
                        <div className="mt-2">
                            <p>{secondTitle}</p>
                            <h3>{secondNumber}</h3>
                        </div>
                    )}
                </div>
                <div className="icon">
                    <i className={`fas ${iconClass}`} />
                </div>
                <a href={link} className="small-box-footer">
                    Más Información <i className="fas fa-arrow-circle-right" />
                </a>
            </div>
        </div>
    );
};

export default CardInfoCustom;
