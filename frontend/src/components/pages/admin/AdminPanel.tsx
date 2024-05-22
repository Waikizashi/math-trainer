import React, { useState } from 'react';
import TheoryForm from './theory-form/TheoryForm.jsx';
import PracticeForm, { PracticeContent } from './practice-form/PracticeForm';
import { mainContainer, section, subContainer } from '../../../utils/styles/global-styles';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import { NavItem } from 'react-bootstrap';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('theory'); // This controls which tab is active

  const handlePracticeFormSubmit = (practiceContent: PracticeContent) => {
    console.log('Practice Content submitted: ', practiceContent);
    // Here you can add code to handle form submission, such as sending data to the backend
  };

  return (
    <div className={mainContainer}>
      <MainMenu></MainMenu>
      <div className="tab nav nav-tabs mt-2">
        <NavItem>
          <button
            onClick={() => setActiveTab('theory')}
            className={cn(activeTab === 'theory' ? 'active' : '', 'nav-link')}
          >
            Theory
          </button>
        </NavItem>
        <NavItem>
          <button
            onClick={() => setActiveTab('exercises')}
            className={cn(activeTab === 'exercises' ? 'active' : '', 'nav-link')}
          >
            Exercises
          </button>
        </NavItem>
      </div>
      <div className={subContainer}>
        <div className={cn(section)} style={{ overflow: 'auto' }}>
          {activeTab === 'theory' && <TheoryForm />}
          {activeTab === 'exercises' && (
            <div>
              <PracticeForm onSubmit={handlePracticeFormSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
