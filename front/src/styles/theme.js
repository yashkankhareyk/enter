import { breakpoints, devices, containerWidths } from './responsive';

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    background: '#f8f9fa',
    text: '#333333',
    border: '#dddddd'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      small: '0.875rem',
      base: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      loose: 2
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    small: '0.25rem',
    default: '0.5rem',
    large: '1rem',
    full: '9999px'
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12)',
    default: '0 2px 4px rgba(0,0,0,0.1)',
    large: '0 4px 6px rgba(0,0,0,0.1)',
    xlarge: '0 8px 12px rgba(0,0,0,0.1)'
  },
  breakpoints,
  devices,
  containerWidths,
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease'
  }
};

export default theme; 