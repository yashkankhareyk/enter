export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  largeDesktop: '1440px'
};

export const devices = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  largeDesktop: `@media (min-width: ${breakpoints.largeDesktop})`
};

export const containerWidths = {
  mobile: '100%',
  tablet: '750px',
  desktop: '970px',
  largeDesktop: '1170px'
}; 