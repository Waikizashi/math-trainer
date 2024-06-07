import React, { useRef } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Fab from '@mui/material/Fab';
import { useLanguage } from '../../context/LanguageContext';

const ExportMenu = ({ svgRef }) => {
    const { translations } = useLanguage();
    const exportAsSvg = () => {
        const svgElement = svgRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(blob, 'graph.svg');
    };

    const exportAsPng = () => {
        const svgElement = svgRef.current;
        toPng(svgElement)
            .then((dataUrl) => {
                saveAs(dataUrl, 'graph.png');
            })
            .catch((error) => {
                console.error('Error exporting as PNG:', error);
            });
    };

    const exportAsJpeg = () => {
        const svgElement = svgRef.current;
        toJpeg(svgElement)
            .then((dataUrl) => {
                saveAs(dataUrl, 'graph.jpg');
            })
            .catch((error) => {
                console.error('Error exporting as JPEG:', error);
            });
    };

    return (
        <DropdownButton
            id="export-menu"
            title={translations.export}
            drop="up"
            variant="dark"
            className="position-fixed bottom-0 end-0 m-2"
            style={{ zIndex: 100 }}
        >
            <Dropdown.Item onClick={exportAsSvg}>{translations.export} SVG</Dropdown.Item>
            <Dropdown.Item onClick={exportAsPng}>{translations.export} PNG</Dropdown.Item>
            <Dropdown.Item onClick={exportAsJpeg}>{translations.export} JPEG</Dropdown.Item>
        </DropdownButton>
    );
};

export default ExportMenu;
