import React, { useEffect, useRef } from 'react';
import MainMenu from '../../navigation/Menu';
import s from './home.module.css';
import cn from 'classnames';
import FloatingGraphs from '../../../utils/visulaEffects/FloatingGraphs';

// Определите типы для props
interface MyComponentProps {
    title: string;
    description?: string; // знак вопроса указывает на необязательный пропс
}

const HomePage: React.FC<MyComponentProps> = ({ title, description }) => {

    const homePageClasses = cn(
        s.homepage,
        'd-flex',
        'justify-content-center',
        'align-items-center'
    )
    const titleClasses = cn(
        s.title,
        'text-center'
    )
    return (
        <>
            <header className=''>
                <div className='container'>
                    <h1 className={titleClasses}>{title}</h1>
                </div>
            </header>
            {/* <FloatingGraphs backgroundColor={"#0a459c"} backgroundImage={""}></FloatingGraphs> */}
            <div className={homePageClasses}>
                <div className={s.container}>
                    <MainMenu />
                </div>
            </div>
        </>
    );
};

export default HomePage;