import { useEffect, useState } from 'react';
import api from '../api';
import { Container, Card, Row, Col } from 'react-bootstrap';

function MemberDashboard() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const res = await api.get('/programs/mine');
      setPrograms(res.data);
    };
    fetchPrograms();
  }, []);

  return (
    <Container className="mt-4">
      <h2>My Programs</h2>
      <Row>
        {programs.map((p) => (
          <Col md={6} key={p.id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{p.type} Plan</Card.Title>
                <Card.Subtitle>{p.title}</Card.Subtitle>
                <Card.Text>
                  <a href={p.contentUrl} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MemberDashboard;
