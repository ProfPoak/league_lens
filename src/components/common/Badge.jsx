function Badge ({ result }) {
    if (!result) return null;

    return (
        <span className={`badge badge--${result.toLowerCase()}`}>
            {result}
        </span>
    );
}

export default Badge