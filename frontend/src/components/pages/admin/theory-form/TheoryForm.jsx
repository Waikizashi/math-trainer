import React, { useState } from 'react';

const TheoryForm = () => {
    const [theory, setTheory] = useState({
        title: "",
        contents: [],
        completions: []
    });

    const handleAddContent = () => {
        const newContent = {
            contentType: "",
            title: "",
            data: "",
            graphDataList: []
        };
        setTheory({ ...theory, contents: [...theory.contents, newContent] });
    };

    const handleInputChange = (index, event) => {
        const newContents = theory.contents.map((content, i) => {
            if (i === index) {
                return { ...content, [event.target.name]: event.target.value };
            }
            return content;
        });
        setTheory({ ...theory, contents: newContents });
    };

    const handleGraphInputChange = (contentIndex, graphIndex, event) => {
        const newContents = theory.contents.map((content, idx) => {
            if (idx === contentIndex) {
                const newGraphDataList = content.graphDataList.map((graphData, gdIndex) => {
                    if (gdIndex === graphIndex) {
                        return { ...graphData, [event.target.name]: event.target.value };
                    }
                    return graphData;
                });
                return { ...content, graphDataList: newGraphDataList };
            }
            return content;
        });
        setTheory({ ...theory, contents: newContents });
    };

    const handleAddGraphData = (contentIndex) => {
        const newGraphData = { title: "", nodes: [], links: [] };
        const newContents = theory.contents.map((content, index) => {
            if (index === contentIndex) {
                return {
                    ...content,
                    graphDataList: [...content.graphDataList, newGraphData]
                };
            }
            return content;
        });
        setTheory({ ...theory, contents: newContents });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Theory Form</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="theoryTitle" className="form-label">Theory Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="theoryTitle"
                        value={theory.title}
                        onChange={e => setTheory({ ...theory, title: e.target.value })}
                    />
                </div>
                {theory.contents.map((content, index) => (
                    <div key={index} className="mb-3">
                        <label className="form-label">Content Type:</label>
                        <select
                            name="contentType"
                            className="form-select"
                            value={content.contentType}
                            onChange={(e) => handleInputChange(index, e)}
                        >
                            <option value="Article">Article</option>
                            <option value="Video">Video</option>
                        </select>
                        <label className="form-label">Title:</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={content.title}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <label className="form-label">Data:</label>
                        <input
                            type="text"
                            name="data"
                            className="form-control"
                            value={content.data}
                            onChange={(e) => handleInputChange(index, e)}
                        />
                        <div>
                            <button type="button" className="btn btn-primary mt-2" onClick={() => handleAddGraphData(index)}>
                                Add Graph Data
                            </button>
                            {content.graphDataList.map((graphData, graphIndex) => (
                                <div key={graphIndex} className="mt-3">
                                    <label className="form-label">Graph Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={graphData.title}
                                        onChange={(e) => handleGraphInputChange(index, graphIndex, e)}
                                    />
                                    {/* Further graph node and link input fields would follow the same pattern */}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="button" className="btn btn-success" onClick={handleAddContent}>
                    Add Content
                </button>
                <button type="submit" className="btn btn-primary mt-3">Save Theory</button>
            </form>
        </div>
    );
};

export default TheoryForm;
