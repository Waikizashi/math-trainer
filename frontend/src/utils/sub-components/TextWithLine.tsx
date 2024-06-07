import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
interface TextWithLineProps {
  lineColor: boolean;
}

const TextWithLine: React.FC<TextWithLineProps> = ({ lineColor }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" style={{ cursor: 'pointer' }}>
      <Typography fontWeight='bold' variant="subtitle2" component="div" >
        {'[id]'}
      </Typography>
      <Box
        width="100%"
        height="3px"
        borderRadius='2px'
        bgcolor={lineColor ? 'white' : 'black'}
      />
    </Box>
  );
};
export default TextWithLine;
