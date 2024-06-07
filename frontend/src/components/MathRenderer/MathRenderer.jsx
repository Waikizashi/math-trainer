// src/components/MathRenderer.js
import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex'

const MathRenderer = ({ expression }) => {
    const renderedExpression = katex.renderToString(expression, {
        throwOnError: false,
    });

    return (
        <span dangerouslySetInnerHTML={{ __html: renderedExpression }} />
    );
};

export default MathRenderer;
