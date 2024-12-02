import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBedPulse, faHospitalUser, faBed, faBars } from '@fortawesome/free-solid-svg-icons';
import '../../assets/scss/components/Sidebar.css';
import AdmittedPatients from '../patient/AdmittedPatients';
import AllPatients from '../patient/AllPatients';
import Users from '../user/Users';
import { useSelector } from 'react-redux'; // Import useSelector
import { useGetUserDataQuery } from '../../store/api/userListApi';


function SidebarComp() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('admittedPatients'); // Default selection

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const {data: loguser } = useGetUserDataQuery();
  const role = loguser?.payload.role;

  // Access the user role from the Redux store
  const renderComponent = () => {
    switch (selectedMenuItem) {
      case 'admittedPatients':
        return <AdmittedPatients />;
      case 'allPatients':
        return <AllPatients />;
      case 'users':
        return <Users />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="home-container">
        <Sidebar collapsed={collapsed} width='250px' collapsedWidth="80px" transitionDuration={500} backgroundColor="#ffffff">
          <Menu>
            <button className='login-right-btn btn btn-dark collapse-btn' onClick={() => setCollapsed(!collapsed)}>
              <FontAwesomeIcon icon={collapsed ? faBars : faBars} />
            </button>
            <MenuItem className={selectedMenuItem === 'admittedPatients' ? 'selected-menu-item' : ''} icon={<FontAwesomeIcon icon={faBedPulse} />} onClick={() => handleMenuItemClick('admittedPatients')}>
              Admitted Patients
            </MenuItem>
            <MenuItem className={selectedMenuItem === 'allPatients' ? 'selected-menu-item' : ''} icon={<FontAwesomeIcon icon={faBed} />} onClick={() => handleMenuItemClick('allPatients')}>
              All Patients
            </MenuItem>
            {role === 'Admin' && ( 
              <MenuItem className={selectedMenuItem === 'users' ? 'selected-menu-item' : ''} icon={<FontAwesomeIcon icon={faHospitalUser} />} onClick={() => handleMenuItemClick('users')}>
                Users
              </MenuItem>
            )}
          </Menu>
        </Sidebar>
        <div className="content-container">
          <div>{renderComponent()}</div>
        </div>
      </div>
    </>
  );
}
export default SidebarComp;