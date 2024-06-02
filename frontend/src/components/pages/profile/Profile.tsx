import React, { useEffect, useRef, useState } from 'react';
import s from './profile.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import okIcon from '../../../assets/ok.png'
import failIcon from '../../../assets/fail.png'
import profileImg from '../../../assets/face.png'
import pendingIcon from '../../../assets/pending.png'
import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import axios from 'axios';

// const theoryCompletions = ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6', 'Topic 7', 'Topic 8', 'Topic 9', 'Topic 10'];
// const practiceCompletions = ['Exercise 1', 'Exercise 2', 'Exercise 3', 'Exercise 4', 'Exercise 5', 'Exercise 6', 'Exercise 7', 'Exercise 8', 'Exercise 9', 'Exercise 10'];
const Profile = () => {
    const [theoryCompletions, setTopics] = useState<any>([]);
    const [practiceCompletions, setExercises] = useState<any>([]);

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
                break;
            case "IN_PROGRESS":
                return pendingIcon
                break;
            case "NOT_STARTED":
                return ''
                break;
            case "FAILED":
                return failIcon
                break;
            default:
                return ''
                break;
        }
    }

    return (
        <div className="mainContainer">
            <div className="subContainer">
                <div className="card text-center mx-2 h-100 w-100">
                    <h5 className="card-header">Profile</h5>
                    <div className="card-body">
                        <div className="row h-100">
                            <div className="col-3">
                                <div className="icon-network mb-3" style={{ textAlign: 'center' }}>
                                    <img src={profileImg} className={s.imgResponsive} />
                                </div>
                                <form>
                                    <div className="my-4">
                                        <input type="text" className="form-control" id="username" placeholder="username" />
                                    </div>
                                    <div className="my-4">
                                        <input type="text" className="form-control" id="name" placeholder="name" />
                                    </div>
                                    <div className="my-4">
                                        <input type="text" className="form-control" id="surname" placeholder="surname" />
                                    </div>
                                    <div className="my-4">
                                        <input type="text" className="form-control" id="id" placeholder="ID" />
                                    </div>
                                </form>
                            </div>

                            <div className='col-9'>
                                <div className="card mb-3">
                                    <h2 className='card-header'>Theory Topics</h2>
                                    <div className={cn("card-body row", s.boxesContainer)}>
                                        {theoryCompletions.map((theoryCompletion: any, index: any) => (
                                            <div key={index} className="col-md-2 mb-3">
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
                                    <h2 className='card-header'>Exercises</h2>
                                    <div className={cn("card-body row", s.boxesContainer)}>
                                        {practiceCompletions.map((practiceCompletion: any, index: any) => (
                                            <div key={index} className="col-md-2 mb-3">
                                                <div className={cn("card", s.taskBox)}>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;