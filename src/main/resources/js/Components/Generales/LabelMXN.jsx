import React from "react";

const LabelMXN = ({ numero }) => {
    const formatCurrency = (value) => {
        const formattedValue = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
        }).format(value);

        return formattedValue;
    };
    return (
        <>
            <label>{formatCurrency(numero)}</label>
        </>
    );
};

export default LabelMXN;
