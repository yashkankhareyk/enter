const extractCoordinates = (url) => {
  try {
    if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) {
      let coords;
      if (url.includes('@')) {
        coords = url.split('@')[1].split(',');
        return {
          latitude: coords[0],
          longitude: coords[1]
        };
      } else if (url.includes('?q=')) {
        coords = url.split('?q=')[1].split(',');
        return {
          latitude: coords[0],
          longitude: coords[1]
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return null;
  }
};

export { extractCoordinates }; 