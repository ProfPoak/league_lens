function EmptyState({ message = "Nothing to show here." }) {
    return (
        <div className="empty-state">
            <p>{message}</p>
        </div>
    );
}

export default EmptyState;