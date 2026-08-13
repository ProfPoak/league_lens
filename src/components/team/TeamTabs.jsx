function TeamTabs({ activeTab, onTabChange }) {
    const tabs = ["overview", "roster", "schedule"]
    
    return (     
        <>
            {tabs.map((tab) => (
                <button 
                    key={tab}
                    role="tab"
                    aria-selected={tab === activeTab}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </>
    )
}

export default TeamTabs