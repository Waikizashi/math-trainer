import React, { useContext, useEffect, useRef, useState } from 'react';
import s from './profile.module.css';
import cn from 'classnames'
import okIcon from '../../../assets/ok.png'
import failIcon from '../../../assets/fail.png'
import profileImg from '../../../assets/face.png'
import pendingIcon from '../../../assets/pending.png'
import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import { NavItem } from 'react-bootstrap';

const Profile = () => {
    const [theoryCompletions, setTopics] = useState<any>([]);
    const [practiceCompletions, setExercises] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<'profile' | 'mygraphs'>('profile');
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { user, logout } = authContext;

    useEffect(() => {
        async function fetchData() {
            try {
                const theoryResponse = await axios.get('http://localhost:8080/api/user-profile/theory-completions');
                setTopics(theoryResponse.data);

                const practiceResponse = await axios.get('http://localhost:8080/api/user-profile/practice-completions');
                setExercises(practiceResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
        fetchData();
    }, []);

    const getIcon = (status: string): string => {
        switch (status) {
            case "COMPLETED":
                return okIcon
            case "IN_PROGRESS":
                return pendingIcon
            case "NOT_STARTED":
                return ''
            case "FAILED":
                return failIcon
            default:
                return ''
        }
    }

    const theoryTopicHandle = (theoryId: number | string) => {
        navigate(`/theory/${theoryId}`)
    }
    const practiceTopicHandle = (practiceId: number | string) => {
        navigate(`/practice/${practiceId}`)
    }

    return (
        <div className={cn(mainContainer)}>
            <div className='m-2 shadow h-100'>
                <div className="card h-100 w-100">
                    {/* <div className="card-header p-0 d-flex justify-content-center">
                        <div className="tab nav nav-tabs mt-2 p-0">
                            <NavItem>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={cn(activeTab === 'profile' ? 'active' : '', 'nav-link')}
                                >
                                    Profile
                                </button>
                            </NavItem>
                            <NavItem>
                                <button
                                    onClick={() => setActiveTab('mygraphs')}
                                    className={cn(activeTab === 'mygraphs' ? 'active' : '', 'nav-link')}
                                >
                                    My Graphs
                                </button>
                            </NavItem>
                        </div>
                    </div> */}
                    <div className="card-body h-100">
                        <div hidden={!(activeTab === 'profile')} className="row h-100">
                            <div className="col-3">
                                <div className="icon-network mb-3" style={{ textAlign: 'center' }}>
                                    <img src={profileImg} className={s.imgResponsive} />
                                </div>
                                <form>
                                    <div className="my-4">
                                        <input disabled type="text" className="form-control text-center" id="username" value={user?.username} />
                                    </div>
                                    <div className="my-4">
                                        <input disabled type="text" className="form-control text-center" id="name" value={user?.email} />
                                    </div>
                                    <div className="my-4">
                                        <input disabled type="text" className="form-control text-center" id="surname" value={user?.role} />
                                    </div>
                                    <div className="my-4">
                                        <input disabled type="text" className="form-control text-center" id="id" value={user?.id} />
                                    </div>
                                </form>
                            </div>

                            <div className='col-9'>
                                <div className="card mb-3">
                                    <h3 className='card-header'>Theory Topics</h3>
                                    <div className={cn("card-body row", s.boxesContainer)}>
                                        {theoryCompletions.map((theoryCompletion: any, index: any) => (
                                            <div onClick={() => theoryTopicHandle(theoryCompletion.theoryId)} key={index} className="col-md-2 mb-3">
                                                <div className={cn("card shadow", s.taskBox)}>
                                                    <div className="card-body text-center">
                                                        <img src={getIcon(theoryCompletion.theoryStatus)} className={s.imgResponsive} />
                                                        <p className='m-0'>{theoryCompletion.theoryTitle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card mb-3">
                                    <h3 className='card-header'>Exercises</h3>
                                    <div className={cn("card-body row", s.boxesContainer)}>
                                        {practiceCompletions.map((practiceCompletion: any, index: any) => (
                                            <div onClick={() => practiceTopicHandle(practiceCompletion.practiceId)} key={index} className="col-md-2 mb-3">
                                                <div className={cn("card shadow", s.taskBox)}>
                                                    <div className="card-body text-center">
                                                        <img src={getIcon(practiceCompletion.practiceStatus)} className={s.imgResponsive} />
                                                        <p className='m-0'>{practiceCompletion.practiceTitle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div hidden={!(activeTab === 'mygraphs')} className="row h-100">
                            <div className='col-12'>
                                <div className="card h-100 mb-3">
                                    <h3 className='card-header'>Theory Topics</h3>
                                    <div className={cn("card-body h-100 row")}>
                                        {theoryCompletions.map((theoryCompletion: any, index: any) => (
                                            <div onClick={() => theoryTopicHandle(theoryCompletion.theoryId)} key={index} className="col-md-2 mb-3">
                                                <div className={cn("card shadow", s.taskBox)}>
                                                    <div className="card-body text-center">
                                                        <img src={getIcon(theoryCompletion.theoryStatus)} className={s.imgResponsive} />
                                                        <p className='m-0'>{theoryCompletion.theoryTitle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;