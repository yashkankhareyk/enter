import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';

const ReviewSection = ({ listingId }) => {
  const { user } = useAuth();
  const { reviews, loading, error: reviewsError, addReview } = useReviews(listingId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    images: []
  });

  const validateReview = () => {
    if (!user) {
      return 'Please login to submit a review';
    }

    if (user.userType !== 'student') {
      return 'Only students can submit reviews';
    }

    if (!newReview.comment.trim()) {
      return 'Please enter a review comment';
    }

    if (newReview.comment.trim().length < 10) {
      return 'Review comment must be at least 10 characters long';
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      return 'Rating must be between 1 and 5';
    }

    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (files.length > 5) {
      alert('You can only upload up to 5 images');
      e.target.value = '';
      return;
    }

    // Validate file size and type
    const invalidFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= maxSize;
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      alert('Some files were rejected. Please ensure all files are images (JPG/PNG) and under 5MB');
      e.target.value = '';
      return;
    }

    setNewReview(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateReview();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append('listingId', listingId);
      formData.append('listing', listingId);
      formData.append('rating', newReview.rating.toString());
      formData.append('comment', newReview.comment.trim());
      formData.append('userId', user._id);

      console.log('Review Data being sent:', {
        listingId,
        listing: listingId,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        userId: user._id,
        imagesCount: newReview.images?.length || 0
      });

      if (newReview.images && newReview.images.length > 0) {
        newReview.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await addReview(formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add review');
      }

      setNewReview({
        rating: 5,
        comment: '',
        images: []
      });
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitError(err.message || 'Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner>Loading reviews...</LoadingSpinner>;
  if (reviewsError) return <ErrorMessage>{reviewsError}</ErrorMessage>;

  return (
    <Container>
      <h2>Reviews</h2>
      
      {user && user.userType === 'student' && (
        <ReviewForm onSubmit={handleSubmit}>
          <h3>Write a Review</h3>
          {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
          
          <FormGroup>
            <label>Rating:</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
              disabled={submitting}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Comment:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              disabled={submitting}
              required
              minLength={10}
              placeholder="Write your review here (minimum 10 characters)"
            />
          </FormGroup>

          <FormGroup>
            <label>Images (optional, max 5):</label>
            <input
              type="file"
              onChange={handleImageChange}
              disabled={submitting}
              multiple
              accept="image/*"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </SubmitButton>
        </ReviewForm>
      )}

      <ReviewList>
        {reviews.length === 0 ? (
          <NoReviews>No reviews yet. Be the first to review!</NoReviews>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <ReviewerName>{review.user.name}</ReviewerName>
                <Rating>{'⭐'.repeat(review.rating)}</Rating>
              </ReviewHeader>
              
              <ReviewComment>{review.comment}</ReviewComment>
              
              {review.images?.length > 0 && (
                <ImageGrid>
                  {review.images.map((image, index) => (
                    <ReviewImage key={index} src={`http://localhost:5001${image}`} alt="Review" />
                  ))}
                </ImageGrid>
              )}

              {review.ownerFeedback && (
                <OwnerFeedback>
                  <h4>Owner's Response:</h4>
                  <p>{review.ownerFeedback.comment}</p>
                </OwnerFeedback>
              )}
            </ReviewCard>
          ))
        )}
      </ReviewList>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #ffebee;
  border-radius: 4px;
`;

const ReviewForm = styled.form`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  select, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  textarea {
    min-height: 100px;
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const ReviewList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #333;
`;

const Rating = styled.div`
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
`;

const ReviewComment = styled.p`
  margin: 1rem 0;
  line-height: 1.5;
  color: #444;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const OwnerFeedback = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h4 {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

export default ReviewSection;