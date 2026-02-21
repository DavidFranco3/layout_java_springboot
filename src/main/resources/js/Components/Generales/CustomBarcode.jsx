import React, { useState } from "react";
import Barcode from "react-barcode";

const CustomBarcode = ({ value }) => {
    return (
        <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
            <Barcode value={value} />
        </div>
    );
};

export default CustomBarcode;
