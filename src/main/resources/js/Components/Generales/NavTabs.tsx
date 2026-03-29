import React, { useState, useEffect } from "react";

const NavTabs = ({ tabs, defaultTab }) => {
    // Set the active tab based on the defaultTab prop
    const [activeTab, setActiveTab] = useState(defaultTab);

    // If the defaultTab prop changes after the initial render, update the active tab
    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);

    return (
        <div className="col-12 col-sm-12">
            <div className="card card-primary card-outline card-outline-tabs">
                <div className="card-header p-0 border-bottom-0">
                    <ul className="nav nav-tabs" id="custom-tabs-four-tab" role="tablist">
                        {tabs.map((tab) => (
                            <li className="nav-item" key={tab.id}>
                                <a
                                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                    id={`custom-tabs-four-${tab.id}-tab`}
                                    href={`#custom-tabs-four-${tab.id}`}
                                    role="tab"
                                    aria-controls={`custom-tabs-four-${tab.id}`}
                                    aria-selected={activeTab === tab.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(tab.id);
                                    }}
                                >
                                    {tab.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-body">
                    <div className="tab-content" id="custom-tabs-four-tabContent">
                        {tabs.map((tab) => (
                            <div
                                className={`tab-pane fade ${activeTab === tab.id ? 'active show' : ''}`}
                                id={`custom-tabs-four-${tab.id}`}
                                role="tabpanel"
                                aria-labelledby={`custom-tabs-four-${tab.id}-tab`}
                                key={tab.id}
                            >
                                {activeTab === tab.id && tab.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavTabs;
