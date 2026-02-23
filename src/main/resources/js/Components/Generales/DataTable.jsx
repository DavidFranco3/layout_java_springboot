import { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DebouncedInput from "./DebouncedInput";
import Skeleton from "./Skeleton";
import { motion, AnimatePresence } from "framer-motion";

const DataTablecustom = ({
    datos = [],
    columnas = [],
    hiddenOptions = false,
    expandableRows = false,
    expandableRowsComponent = null,
    expandableRowExpanded = null,
    isLoading = false,
    ...otherProps
}) => {
    const [filterValue, setFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(datos);
    const [visibleColumns, setVisibleColumns] = useState(columnas.map((col) => col.name));
    const [showModal, setShowModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const tableRef = useRef(null);
    const csvLinkRef = useRef();

    // Skeletons para carga
    const skeletonRows = Array(5).fill({});
    const skeletonColumns = columnas.map(col => ({
        ...col,
        cell: () => <div className="h-4 w-full skeleton rounded-lg opacity-50" />
    }));

    const handleFilterChange = (searchValue) => {
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
        // alert(JSON.stringify(row, null, 2));
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

    const filteredColumns = useMemo(
        () => columnas.filter((col) => visibleColumns.includes(col.name)),
        [columnas, visibleColumns]
    );

    const processedColumns = filteredColumns.map((col) => {
        const { reorder, ...safeProps } = col;
        return {
            ...safeProps,
            sortable: !isLoading,
            center: true,
        };
    });

    const customStyles = {
        header: {
            style: {
                minHeight: '0px',
            },
        },
        headRow: {
            style: {
                backgroundColor: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-light)',
                fontWeight: '700',
                fontSize: '13px',
                color: 'var(--text-muted)',
                minHeight: '56px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                zIndex: 1,
            },
        },
        headCells: {
            style: {
                paddingLeft: '20px',
                paddingRight: '20px',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-main)',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
                '&:not(:last-of-type)': {
                    borderBottom: '1px solid var(--border-light)',
                },
                '&:hover': {
                    backgroundColor: 'rgba(var(--color-primary-rgb, 0, 80, 115), 0.02) !important',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                },
            },
        },
        cells: {
            style: {
                paddingLeft: '20px',
                paddingRight: '20px',
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid var(--border-light)',
                fontSize: '13px',
                minHeight: '64px',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
            },
        },
    };

    return (
        <section className="bg-[var(--card-bg)] rounded-[32px] shadow-premium-lg border border-[var(--border-light)] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5" ref={tableRef}>
            <div className="p-6 md:p-8 border-b border-[var(--border-light)] bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950/20" hidden={hiddenOptions}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="w-full xl:max-w-lg">
                        <DebouncedInput
                            value={filterValue}
                            onChange={handleFilterChange}
                            placeholder="Buscar en la tabla..."
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <CSVLink data={datos} filename="export.csv" ref={csvLinkRef} className="hidden" />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => csvLinkRef.current.link.click()}
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all text-emerald-600 dark:text-emerald-400"
                                title="Exportar CSV"
                            >
                                <i className="fas fa-file-csv text-base" />
                                <span className="hidden sm:inline">CSV</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={downloadPDF}
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all text-rose-600 dark:text-rose-400 disabled:opacity-50"
                                disabled={isExporting}
                                title="Exportar PDF"
                            >
                                <i className={`fas ${isExporting ? 'fa-circle-notch fa-spin' : 'fa-file-pdf'} text-base`} />
                                <span className="hidden sm:inline">PDF</span>
                            </motion.button>

                            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all text-primary"
                                title="Gestionar Columnas"
                            >
                                <i className="fas fa-columns text-base" />
                                <span className="hidden sm:inline">VER</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && datos.length === 0 ? (
                <div className="animate-fade-in p-0">
                    <Skeleton.Table rows={8} cols={columnas.length} />
                </div>
            ) : (
                <div className={`overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                    <DataTable
                        columns={isLoading ? skeletonColumns : processedColumns}
                        data={isLoading ? skeletonRows : filteredData}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                        pointerOnHover
                        responsive
                        fixedHeader
                        fixedHeaderScrollHeight="calc(100vh - 420px)"
                        onRowDoubleClicked={handleDoubleClick}
                        customStyles={customStyles}
                        expandableRows={expandableRows}
                        expandableRowsComponent={expandableRowsComponent}
                        expandableRowExpanded={expandableRowExpanded}
                        {...otherProps}
                        noDataComponent={
                            <div className="py-24 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-24 h-24 bg-gradient-to-tr from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-[var(--border-light)] shadow-sm"
                                >
                                    <i className="fas fa-folder-open text-4xl text-slate-300 dark:text-slate-600" />
                                </motion.div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Estamos vacíos por aquí</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs mx-auto">No hay registros que coincidan o la lista está vacía actualmente.</p>
                            </div>
                        }
                    />
                </div>
            )}

            {/* Modal de Columnas */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-[var(--card-bg)] w-full max-w-md rounded-3xl shadow-premium-lg border border-[var(--border-light)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
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
                                <PrimaryButton onClick={() => setShowModal(false)}>
                                    Aplicar Cambios
                                </PrimaryButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default DataTablecustom;
