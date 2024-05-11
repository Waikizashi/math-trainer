import React, { useState } from 'react';
import TheoryForm from './theory-form/TheoryForm.jsx';
import { mainContainer, section, subContainer } from '../../../utils/styles/global-styles';

import MainMenu from '../../navigation/Menu';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('theory');  // This controls which tab is active

    return (
        <div className={mainContainer}>
            <MainMenu></MainMenu>
            <div className="tab">
                <button onClick={() => setActiveTab('theory')} className={activeTab === 'theory' ? 'active' : ''}>
                    Theory
                </button>
                <button onClick={() => setActiveTab('exercises')} className={activeTab === 'exercises' ? 'active' : ''}>
                    Exercises
                </button>
            </div>
            <div className={subContainer}>
                <div className={section} style={{ overflow: "auto" }}>
                    {activeTab === 'theory' && <TheoryForm />}
                    {activeTab === 'exercises' && <div>Exercises Content Here</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
