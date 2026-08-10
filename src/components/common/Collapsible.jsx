
function Collapsible({ isOpen, children }) {
    return (
        <div className={isOpen ? "collapsible collapsible--open" : "collapsible"}>
            <div className="collapsible__inner">
            {children}
            </div>
        </div>
    );
}

export default Collapsible