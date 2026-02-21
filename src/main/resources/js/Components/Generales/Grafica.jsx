import React, { useState } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-plugin-datalabels"; // Importa el plugin
import CustomSelect from "./CustomSelect";

const DynamicChart = ({
    frecuencias = [0],
    etiquetas = ["Sin datos"],
    chartTitle = "",
    titInfo = "",
    alto = "",
}) => {
    // Agrega un estado local para el tipo de gráfico
    const [chartType, setChartType] = useState("pie");

    // Datos para el CustomSelect
    const chartTypes = [
        { value: "line", label: "Línea" },
        { value: "bar", label: "Barra" },
        { value: "pie", label: "Pastel" },
        { value: "doughnut", label: "Rosquilla" },
    ];
    const formatCurrency = (value) => {
        const formattedValue = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
        }).format(value);

        return formattedValue;
    };

    // Genera un color aleatorio para cada barra o segmento del gráfico
    const randomColors = etiquetas.map(
        () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    const data = {
        labels: etiquetas,
        datasets: [
            {
                label: titInfo,
                backgroundColor: randomColors,
                borderColor: randomColors,
                data: frecuencias,
            },
        ],
    };

    // Calcula el total de los datos
    const total = frecuencias.reduce((a, b) => a + b, 0);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text:
                    chartType === "bar"
                        ? chartTitle + " (Total asignado: " + formatCurrency(total) + ")"
                        : chartTitle, // Muestra el total solo para gráficos de barras
            },
            datalabels: {
                color: "#fff",
                formatter: (value, context) => {
                    return value; // Muestra el valor total
                },
            },
        },
    };

    // Determina el tipo de gráfico dinámicamente
    let ChartComponent;

    switch (chartType) {
        case "line":
            ChartComponent = Line;
            break;
        case "bar":
            ChartComponent = Bar;
            break;
        case "pie":
            ChartComponent = Pie;
            break;
        case "doughnut":
            ChartComponent = Doughnut;
            break;
        default:
            ChartComponent = Line;
    }

    return (
        <div className="flex justify-center items-center">
            <div className="row">
                <div className="row">
                    <CustomSelect
                        dataOptions={chartTypes}
                        preDefaultValue={chartType}
                        setValue={setChartType}
                        useFilter={true}
                    />
                </div>
                <div
                    className="row flex justify-center items-center w-full"
                    style={{ maxHeight: alto, overflow: 'auto'}}
                >
                    <ChartComponent data={data} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default DynamicChart;
