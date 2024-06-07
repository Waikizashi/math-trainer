import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
interface OnlyTextProps {
  text: string;
}

const OnlyText: React.FC<OnlyTextProps> = ({ text }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" style={{ cursor: 'pointer' }}>
      <Typography fontWeight='bold' variant="subtitle2" component="div" >
        {text}
      </Typography>
    </Box>
  );
};
export default OnlyText;
