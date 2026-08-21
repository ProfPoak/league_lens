function TeamTabs({ activeTab, onTabChange }) {
    const tabs = ["overview", "roster"]
    
    return (     
        <div className="team-tabs">
            {tabs.map((tab) => (
                <button 
                    key={tab}
                    role="tab"
                    className="team-tabs__button"
                    aria-selected={tab === activeTab}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

export default TeamTabs