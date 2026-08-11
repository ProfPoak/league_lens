function FilterInput({ value, onChange, placeholder = "Filter teams..." }) {
    return (
        <input
            type="text"
            className="filter-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
        />
    );
}

export default FilterInput;