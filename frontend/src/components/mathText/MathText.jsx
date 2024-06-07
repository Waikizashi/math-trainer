import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathText = ({ text }) => {
    const regex = /{math}(.*?){\/math}/g;

    const parts = [];
    let lastIndex = 0;

    text.replace(regex, (match, math, offset) => {
        if (offset > lastIndex) {
            parts.push({ text: text.substring(lastIndex, offset) });
        }
        parts.push({ math });
        lastIndex = offset + match.length;
    });

    if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex) });
    }

    return (
        <div>
            {parts.map((part, index) =>
                part.math ? (
                    <BlockMath key={index} math={part.math} />
                ) : (
                    <span key={index}>{part.text}</span>
                )
            )}
        </div>
    );
};

export default MathText;
