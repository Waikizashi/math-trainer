import React from 'react';
import Fab from '@mui/material/Fab';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TimelineIcon from '@mui/icons-material/Timeline';
import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import AppsIcon from '@mui/icons-material/Apps';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import SwipeUpAltIcon from '@mui/icons-material/SwipeUpAlt';
import PinIcon from '@mui/icons-material/Pin';
import AbcIcon from '@mui/icons-material/Abc';
import MoveIcon from '@mui/icons-material/OpenWith';
import cn from 'classnames';
import TextWithLine from '../../utils/sub-components/TextWithLine';
import NumberWithLine from '../../utils/sub-components/NumberWithLine';
import OnlyText from '../../utils/sub-components/OnlyText';
import { useLanguage } from '../../context/LanguageContext';

interface ControlPanelProps {
    zoomIn: () => void;
    zoomOut: () => void;
    setAdding: () => void;
    setMatrix: () => void;
    setColoring: () => void;
    setNodeIdType: () => void;
    cleanAll: () => void;
    setLining: () => void;
    setWeightDisplay: () => void;
    setLinkIdDisplay: () => void;
    setDegreeDisplay: () => void;
    setDirections: () => void;
    setSwiping: () => void;
    enableDragging: () => void;
    settingsHandle: () => void;
    addBtn: boolean;
    matrixBtn: boolean;
    showColors: boolean;
    nodeIdType: 'number' | 'letter';
    linesBtn: boolean;
    weightBtn: boolean;
    showLinkIds: boolean;
    showDirections: boolean;
    swipeBtn: boolean;
    showDegree: boolean;
    draggingEnabled: boolean;
    isFullControl: boolean;
    isPartControl: boolean;
    s: any;
    rangeControlStyle: string;
    nodeScale: number;
    edgeLengthScale: number;
    edgeSizeScale: number;
    textScale: number;
    repulsiveDistanceScale: number;
    repulsiveForceScale: number;
    nodeSizeChange: (e: any) => void;
    edgeLengthChange: (e: any) => void;
    edgeSizeChange: (e: any) => void;
    textSizeChange: (e: any) => void;
    repulsiveDistanceChange: (e: any) => void;
    repulsiveForceChange: (e: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    zoomIn,
    zoomOut,
    setAdding,
    setMatrix,
    setColoring,
    setNodeIdType,
    cleanAll,
    setLining,
    setWeightDisplay,
    setLinkIdDisplay,
    setDegreeDisplay,
    setDirections,
    setSwiping,
    enableDragging,
    settingsHandle,
    addBtn,
    matrixBtn,
    showColors,
    nodeIdType,
    linesBtn,
    weightBtn,
    showLinkIds,
    showDirections,
    swipeBtn,
    showDegree,
    draggingEnabled,
    isFullControl,
    isPartControl,
    s,
    rangeControlStyle,
    nodeScale,
    edgeLengthScale,
    edgeSizeScale,
    textScale,
    repulsiveDistanceScale,
    repulsiveForceScale,
    nodeSizeChange,
    edgeLengthChange,
    edgeSizeChange,
    textSizeChange,
    repulsiveDistanceChange,
    repulsiveForceChange,
}) => {
    const { translations } = useLanguage();

    const tool = cn(
        "m-1",
        "border border-primary border-1"
    );
    const tools = cn(
        "shadow",
        "bg-white",
        "bg-opacity-75",
        "border",
        "border-primary",
        "border-opacity-50",
        "rounded-1",
        "p-1",
        "mt-1",
        "mx-1"
    );
    return (
        <div className="d-flex justify-content-space top-0 end-0" style={{ zIndex: 98, position: 'absolute' }}>
            <div className={cn(tools)}>
                <Fab onClick={zoomIn} className={tool} size='small'>
                    <ZoomInIcon />
                </Fab>
                <Fab onClick={zoomOut} className={tool} size='small'>
                    <ZoomOutIcon />
                </Fab>
            </div>
            <div className={cn(tools)}>
                <Fab color={draggingEnabled ? 'primary' : 'default'} onClick={enableDragging} className={tool} size='small'>
                    <MoveIcon />
                </Fab>
                <Fab hidden={!(isFullControl || isPartControl)} color={swipeBtn ? 'primary' : 'default'} onClick={setSwiping} className={tool} size='small'>
                    <SwipeVerticalIcon />
                </Fab>
            </div>
            <div hidden={!(isFullControl || isPartControl)} className={cn(tools)}>
                <Fab color={addBtn ? 'primary' : 'default'} onClick={setAdding} className={tool} size='small'>
                    <AddCircleOutlineIcon />
                </Fab>
                <Fab color={linesBtn ? 'primary' : 'default'} onClick={setLining} className={tool} size='small'>
                    <TimelineIcon />
                </Fab>
                <Fab onClick={cleanAll} className={tool} size='small'>
                    <DeleteForeverIcon />
                </Fab>
            </div>
            <div hidden={!isFullControl} className={cn(tools)}>
                <Fab color={matrixBtn ? 'primary' : 'default'} onClick={setMatrix} className={tool} size='small'>
                    <AppsIcon />
                </Fab>
            </div>
            <div className={cn(tools)}>
                <Fab color={showColors ? 'primary' : 'default'} onClick={setColoring} className={tool} size='small'>
                    <ColorLensIcon />
                </Fab>
                <Fab hidden={!(isFullControl || isPartControl)} color={nodeIdType === 'number' ? 'success' : 'warning'} onClick={setNodeIdType} className={tool} size='small'>
                    {nodeIdType === 'number' ? <PinIcon /> : <AbcIcon />}
                </Fab>

                <Fab hidden={!(isFullControl || isPartControl)} color={weightBtn ? 'primary' : 'default'} onClick={setWeightDisplay} className={tool} size='small'>
                    <NumberWithLine lineColor={weightBtn} />
                </Fab>
                <Fab hidden={!(isFullControl || isPartControl)} color={showLinkIds ? 'primary' : 'default'} onClick={setLinkIdDisplay} className={tool} size='small'>
                    <TextWithLine lineColor={showLinkIds} />
                </Fab>
                <Fab color={showDegree ? 'primary' : 'default'} onClick={setDegreeDisplay} className={tool} size='small'>
                    <OnlyText text={'deg'} />
                </Fab>
                <Fab hidden={!(isFullControl || isPartControl)} color={showDirections ? 'primary' : 'default'} onClick={setDirections} className={tool} size='small'>
                    <SwipeUpAltIcon />
                </Fab>
            </div>
            <div hidden={!(isFullControl)} className={cn(tools)}>
                <div className="btn-group dropstart">
                    <Fab onClick={settingsHandle} type="button" className={cn("btn dropdown-toggle", tool, s.beforeOff)} data-bs-toggle="dropdown" aria-expanded="false" size='small'>
                        <SettingsIcon />
                    </Fab>
                    <ul style={{ width: "max-content", zIndex: 1111 }} className="dropdown-menu mx-2 p-2 border-primary border-1">
                        <li>
                            <div className={rangeControlStyle}>{translations.nodeSize}
                                <output className='mx-1'>{nodeScale}</output>
                            </div>
                            <input onChange={nodeSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                        </li>
                        <li>
                            <div className={rangeControlStyle}>{translations.edgeLength}
                                <output className='mx-1'>{edgeLengthScale}</output>
                            </div>
                            <input onChange={edgeLengthChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                        </li>
                        <li>
                            <div className={rangeControlStyle}>{translations.edgeSize}
                                <output className='mx-1'>{edgeSizeScale}</output>
                            </div>
                            <input onChange={edgeSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                        </li>
                        <li>
                            <div className={rangeControlStyle}>{translations.textSize}
                                <output className='mx-1'>{textScale}</output>
                            </div>
                            <input onChange={textSizeChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                        </li>
                        <li>
                            <div className={rangeControlStyle}>{translations.repulsiveDistance}
                                <output className='mx-1'>{repulsiveDistanceScale}</output>
                            </div>
                            <input onChange={repulsiveDistanceChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                        </li>
                        <li>
                            <div className={rangeControlStyle}>{translations.repulsiveForce}
                                <output className='mx-1'>{repulsiveForceScale}</output>
                            </div>
                            <input onChange={repulsiveForceChange} type="range" min={0.1} max={10} step={0.1} defaultValue={1} className="form-range" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
