import React from 'react';
import { TopicTemplate } from '../../../data/TopicTemplate';

// Предполагаем, что объект `sectionData` получен из базы данных и передан в компонент
const TheorySection: React.FC<any> = ({ }) => {
  const sectionData: TopicTemplate[] = [];
  return (
    <div className="theory-section">
      {/* <h2>{sectionData.title}</h2>
      <p>{sectionData.content}</p>
      {sectionData.sectionIllustration && (
        <img src={sectionData.sectionIllustration} alt="Иллюстрация подраздела" />
      )}
      {sectionData.definitions.map((definition, index) => (
        <div key={index} className="definition">
          <h3>{definition.term}</h3>
          <p>{definition.description}</p>
          {definition.illustration && (
            <img src={definition.illustration} alt={`Иллюстрация ${definition.term}`} />
          )}
        </div>
      ))} */}
    </div>
  );
};

export default TheorySection;
