import React, { useState } from 'react';
import TheoryForm from './theory-form/TheoryForm';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('theory');  // This controls which tab is active

    return (
        <div>
            <div className="tab">
                <button onClick={() => setActiveTab('theory')} className={activeTab === 'theory' ? 'active' : ''}>
                    Theory
                </button>
                <button onClick={() => setActiveTab('exercises')} className={activeTab === 'exercises' ? 'active' : ''}>
                    Exercises
                </button>
            </div>
            <div className="content">
                {activeTab === 'theory' && <TheoryForm />}
                {activeTab === 'exercises' && <div>Exercises Content Here</div>}
            </div>
        </div>
    );
};

export default AdminPage;
