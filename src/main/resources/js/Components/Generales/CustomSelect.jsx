import React from 'react';
import Select from 'react-select';

const CustomSelect = ({ dataOptions = [], preDefaultValue = null, setValue, useFilter = false, onInputChange, placeholder, isDisabled = false }) => {
    const handleSelectChange = (selectedOption) => {
        setValue(selectedOption ? selectedOption.value : null);
    };

    // Función de filtro para la búsqueda en tiempo real (opcional)
    const customFilterOption = (option, rawInput) => {
        const words = rawInput.split('-').map(word => word.trim());
        const regex = new RegExp(words.join('|'), 'i');
        return regex.test(option.label);
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--border-light)',
            borderRadius: '0.75rem',
            padding: '2px 4px',
            boxShadow: state.isFocused ? '0 0 0 4px var(--color-primary-soft)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--text-muted)',
            },
            transition: 'all 0.2s ease',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'var(--card-bg)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-premium-lg)',
            padding: '4px',
            zIndex: 50,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'var(--color-primary)'
                : state.isFocused
                    ? 'var(--color-primary-soft)'
                    : 'transparent',
            color: state.isSelected
                ? 'white'
                : 'var(--text-main)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            padding: '8px 12px',
            '&:active': {
                backgroundColor: 'var(--color-primary)',
                color: 'white',
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--text-main)',
        }),
        input: (base) => ({
            ...base,
            color: 'var(--text-main)',
        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--text-muted)',
        }),
    };

    return (
        <div className="custom-select-wrapper">
            <Select
                styles={customStyles}
                className="basic-single"
                classNamePrefix="select"
                value={dataOptions.find(option => option.value === preDefaultValue)}
                isClearable={true}
                isSearchable={true}
                options={dataOptions}
                onChange={handleSelectChange}
                filterOption={useFilter ? customFilterOption : undefined}
                onInputChange={onInputChange}
                placeholder={placeholder || "Seleccionar..."}
                isDisabled={isDisabled}
            />
        </div>
    );
};


export default CustomSelect;
