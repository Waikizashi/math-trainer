import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
interface NumberWithLineOrArrowProps {
  lineColor: boolean;
}

const NumberWithLineOrArrow: React.FC<NumberWithLineOrArrowProps> = ({ lineColor }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" style={{ cursor: 'pointer' }}>
      <Typography fontWeight='bold' variant="subtitle2" component="div" >
        123
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
export default NumberWithLineOrArrow;
