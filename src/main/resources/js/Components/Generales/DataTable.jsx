import { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DebouncedInput from "./DebouncedInput";

const DataTablecustom = ({
    datos = [],
    columnas = [],
    hiddenOptions = false,
    expandableRows = false,
    expandableRowsComponent = null,
    expandableRowExpanded = null,
    ...otherProps
}) => {
    const [filterValue, setFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(datos);
    const [visibleColumns, setVisibleColumns] = useState(columnas.map((col) => col.name));
    const [showModal, setShowModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const tableRef = useRef(null);
    const csvLinkRef = useRef();

    const handleFilterChange = (searchValue) => {
        // const searchValue = event.target.value.trim(); // Ya viene como string desde DebouncedInput
        setFilterValue(searchValue);

        if (!searchValue || searchValue.length === 0) {
            setFilteredData(datos);
            return;
        }

        const searchLower = searchValue.toLowerCase();

        const filtered = datos.filter((row) =>
            Object.values(row).some((value) => {
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchLower);
            })
        );

        setFilteredData(filtered);
    };

    const handleDoubleClick = (row) => {
        alert(JSON.stringify(row, null, 2));
    };

    useEffect(() => {
        setFilteredData(datos);
    }, [datos]);

    const downloadPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            const doc = new jsPDF();
            const tableColumn = columnas
                .filter((col) => visibleColumns.includes(col.name) && col.name !== "Acciones")
                .map((col) => col.name);

            const tableRows = datos.map((row) => {
                const rowData = columnas
                    .filter((col) => visibleColumns.includes(col.name) && col.name !== "Acciones")
                    .map((col) => {
                        let value;
                        if (typeof col.selector === "function") {
                            value = col.selector(row);
                        } else {
                            value = row[col.selector];
                        }
                        const formattedValue =
                            value !== undefined &&
                                value !== null &&
                                typeof value === "object"
                                ? JSON.stringify(value)
                                : value || "";
                        return formattedValue;
                    });
                return rowData;
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: "grid",
                styles: {
                    halign: "justify",
                },
            });
            doc.save("data.pdf");
            setIsExporting(false);
        }, 100);
    };

    const handleColumnVisibilityChange = (columnName) => {
        setVisibleColumns((prevVisibleColumns) =>
            prevVisibleColumns.includes(columnName)
                ? prevVisibleColumns.filter((name) => name !== columnName)
                : [...prevVisibleColumns, columnName]
        );
    };

    const selectAllColumns = () => {
        setVisibleColumns(columnas.map((col) => col.name));
    };

    const deselectAllColumns = () => {
        setVisibleColumns([]);
    };

    // ✅ Columnas visibles memoizadas
    const filteredColumns = useMemo(
        () => columnas.filter((col) => visibleColumns.includes(col.name)),
        [columnas, visibleColumns]
    );

    const dynamicStyles = "";

    const processedColumns = filteredColumns.map((col) => {
        const {
            reorder,
            ...safeProps
        } = col;

        return {
            ...safeProps,
            sortable: true,
        };
    });


    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "var(--dt-header-bg)",
                borderBottom: "2px solid var(--dt-border-color)",
                fontWeight: "600",
                fontSize: "14px",
                color: "var(--dt-header-text)",
                minHeight: "52px",
            },
        },
        headCells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
                whiteSpace: "nowrap",
                justifyContent: "center",
                textAlign: "center",
            },
        },
        rows: {
            style: {
                fontSize: "13px",
                color: "var(--dt-row-text)",
                backgroundColor: "var(--dt-bg)",
                minHeight: "48px",
                "&:hover": {
                    backgroundColor: "var(--dt-row-hover-bg)",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    color: "var(--dt-row-text)",
                },
            },
            stripedStyle: {
                backgroundColor: "var(--dt-row-stripe-bg)",
                color: "var(--dt-row-text)",
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
                justifyContent: "center",
                textAlign: "center",
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid var(--dt-border-color)",
                fontSize: "13px",
                minHeight: "56px",
                backgroundColor: "var(--dt-bg)",
                color: "var(--dt-row-text)",
            },
            pageButtonsStyle: {
                color: "var(--dt-row-text)",
                fill: "var(--dt-row-text)",
                "&:disabled": {
                    color: "var(--dt-disabled-text)",
                    fill: "var(--dt-disabled-text)",
                },
                "&:hover:not(:disabled)": {
                    backgroundColor: "var(--dt-row-hover-bg)",
                },
                "&:focus": {
                    outline: "none",
                    backgroundColor: "var(--dt-row-hover-bg)",
                },
            },
        },
    };

    return (
        <section className="bg-[var(--card-bg)] rounded-2xl shadow-premium border border-[var(--border-light)] overflow-hidden transition-all duration-300" ref={tableRef}>
            <style>{`
                ${dynamicStyles}
                
                .rdt_Table {
                    background-color: transparent !important;
                }
                
                .rdt_Pagination {
                    background-color: var(--card-bg) !important;
                    color: var(--text-main) !important;
                    border-top: 1px solid var(--border-light) !important;
                }
            `}</style>

            <div className="p-4 md:p-6 border-b border-[var(--border-light)] bg-slate-50/50 dark:bg-slate-900/50" hidden={hiddenOptions}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full md:max-w-md">
                        <DebouncedInput
                            value={filterValue}
                            onChange={handleFilterChange}
                            placeholder="Buscar en todos los campos..."
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold border border-primary/20 uppercase tracking-tight">
                            {filteredData.length} de {datos.length} registros
                        </span>

                        <div className="flex items-center gap-2">
                            <div className="hidden">
                                <CSVLink
                                    data={datos}
                                    filename="data-export.csv"
                                    ref={csvLinkRef}
                                />
                            </div>

                            <button
                                onClick={() => csvLinkRef.current.link.click()}
                                className="group inline-flex items-center gap-2 px-4 h-10 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-[11px] font-bold transition-all duration-300 active:scale-95"
                            >
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center transition-colors group-hover:bg-emerald-500/20">
                                    <i className="fas fa-file-csv text-sm" />
                                </div>
                                <span className="uppercase tracking-wider">CSV</span>
                            </button>

                            <button
                                onClick={downloadPDF}
                                className="group inline-flex items-center gap-2 px-4 h-10 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-[11px] font-bold transition-all duration-300 active:scale-95 disabled:opacity-50"
                                disabled={isExporting}
                            >
                                <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center transition-colors group-hover:bg-rose-500/20">
                                    <i className="fas fa-file-pdf text-sm" />
                                </div>
                                <span className="uppercase tracking-wider">{isExporting ? "..." : "PDF"}</span>
                            </button>

                            <button
                                className="group inline-flex items-center gap-2 px-4 h-10 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-xl text-[11px] font-bold transition-all duration-300 active:scale-95"
                                onClick={() => setShowModal(true)}
                            >
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                                    <i className="fas fa-columns text-sm" />
                                </div>
                                <span className="uppercase tracking-wider">Columnas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden">
                <DataTable
                    columns={processedColumns}
                    data={filteredData}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                    striped
                    highlightOnHover
                    pointerOnHover
                    responsive
                    fixedHeader
                    fixedHeaderScrollHeight="calc(100vh - 280px)"
                    onRowDoubleClicked={handleDoubleClick}
                    customStyles={customStyles}
                    expandableRows={expandableRows}
                    expandableRowsComponent={expandableRowsComponent}
                    expandableRowExpanded={expandableRowExpanded}
                    {...otherProps}
                    noDataComponent={
                        <div className="py-20 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--border-light)] shadow-sm">
                                <i className="fas fa-inbox text-3xl text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Sin resultados</h3>
                            <p className="text-slate-500 text-sm">No encontramos registros que coincidan con tu búsqueda</p>
                        </div>
                    }
                />
            </div>

            {/* Modal de Columnas */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
                    <div className="bg-[var(--card-bg)] w-full max-w-md rounded-3xl shadow-premium-lg border border-[var(--border-light)] overflow-hidden animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 py-5 bg-primary text-white flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <i className="fas fa-columns" />
                                </div>
                                Gestionar Columnas
                            </h3>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="flex gap-3 mb-6">
                                <button className="flex-1 px-3 py-2.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all uppercase tracking-wider" onClick={selectAllColumns}>
                                    Seleccionar Todo
                                </button>
                                <button className="flex-1 px-3 py-2.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-wider" onClick={deselectAllColumns}>
                                    Deseleccionar Todo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-1">
                                {columnas.map((col) => (
                                    <label key={col.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg text-primary focus:ring-primary/20 border-slate-300 dark:border-slate-700 dark:bg-slate-950"
                                            checked={visibleColumns.includes(col.name)}
                                            onChange={() => handleColumnVisibilityChange(col.name)}
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{col.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 border-t border-[var(--border-light)] bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" onClick={() => setShowModal(false)}>
                                Cerrar
                            </button>
                            <button className="px-8 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95" onClick={() => setShowModal(false)}>
                                Aplicar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DataTablecustom;
