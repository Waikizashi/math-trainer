import React, { useState } from 'react';
import TheoryForm from './theory-form/TheoryForm';
import PracticeForm from './practice-form/PracticeForm';
import { mainContainer, section, subAdminContainer } from '../../../utils/styles/global-styles';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import { NavItem } from 'react-bootstrap';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('theory');

  return (
    <div className={mainContainer}>
      {/* <MainMenu /> */}
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
      <div className={subAdminContainer}>
        <div className={cn(section)} style={{ overflow: 'auto' }}>
          {activeTab === 'theory' && <TheoryForm />}
          {activeTab === 'exercises' && <div><PracticeForm /></div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
