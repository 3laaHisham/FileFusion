import { forwardRef } from 'react';
import { Icon, disableCache } from '@iconify/react';

import Box from '@mui/material/Box';

import { iconifyClasses } from './classes';

import type { IconifyProps } from './types';

// ----------------------------------------------------------------------

export const Iconify = forwardRef<SVGElement, IconifyProps>(
  ({ className, width = 20, sx, ...other }, ref) => (
    <Box
      ssr
      ref={ref}
      component={Icon}
      className={iconifyClasses.root.concat(className ? ` ${className}` : '')}
      sx={{
        width,
        height: width,
        flexShrink: 0,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    />
  )
);

export const iconForType: Record<string, { url: string; color: string }> = {
  Folder: {
    url: 'eva:folder-fill',
    color: '#FFCC00', // Example color for Folder
  },
  Pdf: {
    url: 'teenyicons:pdf-solid',
    color: '#FF3D00', // Example color for Pdf
  },
  Image: {
    url: 'eva:image-fill',
    color: '#4CAF50', // Example color for Image
  },
  Video: {
    url: 'ic:baseline-video-file',
    color: '#2196F3', // Example color for Video
  },
  Audio: {
    url: 'eva:headphones-fill',
    color: '#FF5722', // Example color for Audio
  },
  Archive: {
    url: 'eva:archive-fill',
    color: '#795548', // Example color for Archive
  },
  Word: {
    url: 'ri:file-word-2-fill',
    color: '#0072C6', // Example color for Word
  },
  Excel: {
    url: 'ri:file-excel-2-fill',
    color: '#57A64A', // Example color for Excel
  },
  Presentation: {
    url: 'mingcute:presentation-2-fill',
    color: '#E91E63', // Example color for Presentation
  },
  Text: {
    url: 'eva:file-text-fill',
    color: '#FF3D00', // Example color for Text
  },
  Unknown: {
    url: 'eva:file-fill',
    color: '#B0BEC5', // Example color for Unknown
  },
};



// https://iconify.design/docs/iconify-icon/disable-cache.html
disableCache('local');
