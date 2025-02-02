export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const cleanPath = imagePath
    .split('\\').pop()
    .split('/').pop();
    
  return `${process.env.REACT_APP_API_URL}/uploads/listings/${cleanPath}`;
}; 