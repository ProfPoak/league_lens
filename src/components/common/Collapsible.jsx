
function Collapsible({ id, isOpen, children }) {
    return (
        <div id={id} className={isOpen ? "collapsible collapsible--open" : "collapsible"}>
            <div className="collapsible__inner">
            {children}
            </div>
        </div>
    );
}

export default Collapsible