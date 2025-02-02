import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';

const PGCardWrapper = styled(Card)`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PGImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
`;

const PGDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PGCard = ({ pg }) => {
  return (
    <PGCardWrapper>
      <PGImage src={pg.image || '/placeholder.jpg'} alt={pg.name} />
      <PGDetails>
        <h3>{pg.name}</h3>
        <p>{pg.location}</p>
        <p>₹{pg.rent}/month</p>
        <div>
          <Button primary>View Details</Button>
          <Button outline style={{ marginLeft: '0.5rem' }}>Contact Owner</Button>
        </div>
      </PGDetails>
    </PGCardWrapper>
  );
};

export default PGCard;
