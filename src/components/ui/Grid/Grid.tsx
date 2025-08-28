import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface GridProps {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const CustomGrid: React.FC<GridProps> = ({
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 0,
  children,
  sx = {}
}) => {
  const getFlexBasis = (breakpoint: number | undefined): string => {
    if (!breakpoint) return 'auto';
    return `${(breakpoint / 12) * 100}%`;
  };

  const containerStyles: SxProps<Theme> = container
    ? {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing ? `${spacing * 8}px` : 0,
        ...sx
      }
    : {};

  const itemStyles: SxProps<Theme> = item
    ? {
        flexBasis: {
          xs: xs ? getFlexBasis(xs) : 'auto',
          sm: sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto',
          md: md ? getFlexBasis(md) : sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto',
          lg: lg ? getFlexBasis(lg) : md ? getFlexBasis(md) : sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto',
          xl: xl ? getFlexBasis(xl) : lg ? getFlexBasis(lg) : md ? getFlexBasis(md) : sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto'
        },
        maxWidth: {
          xs: xs ? getFlexBasis(xs) : 'auto',
          sm: sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto',
          md: md ? getFlexBasis(md) : sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto',
          lg: lg ? getFlexBasis(lg) : md ? getFlexBasis(md) : sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto',
          xl: xl ? getFlexBasis(xl) : lg ? getFlexBasis(lg) : md ? getFlexBasis(md) : sm ? getFlexBasis(sm) : xs ? getFlexBasis(xs) : 'auto'
        },
        flexGrow: 0,
        flexShrink: 0,
        ...sx
      }
    : { ...sx };

  const combinedStyles = { ...containerStyles, ...itemStyles };

  return (
    <Box sx={combinedStyles}>
      {children}
    </Box>
  );
};

export default CustomGrid;
export { CustomGrid as Grid };