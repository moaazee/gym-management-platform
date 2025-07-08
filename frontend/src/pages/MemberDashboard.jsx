import { useEffect, useState } from "react";
import api from "../api";
import {
  Container,
  Card,
  Row,
  Col,
  Modal,
  Button,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function MemberDashboard() {
  const [programs, setPrograms] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      const res = await api.get("/programs/mine");
      setPrograms(res.data);
    };
    fetchPrograms();
  }, []);

  const openMedia = (url) => {
    setSelectedMedia(url);
    setShowModal(true);
  };

  return (
    <Row className="member-layout">
      <Col md={2} className="p-0">
        <Sidebar />
      </Col>
      <Col md={10}>
        <Container className="py-4">
          <h2 className="text-center mb-4">My Assigned Programs</h2>
          {programs.map((program) => (
            <Card key={program.id} className="mb-4 shadow-sm">
              <Card.Header className="bg-light fw-bold text-uppercase">
                {program.type} Program: {program.title}
              </Card.Header>
              <Card.Body>
                <p>{program.description}</p>
                {program.items?.length > 0 && (
                  <>
                    <h6 className="fw-bold mt-3">Items:</h6>
                    {program.items.map((item, idx) => (
                      <Card key={idx} className="mb-2 border-0 border-start border-4 border-warning">
                        <Card.Body>
                          <h6 className="mb-1 fw-semibold">{item.title}</h6>
                          <p className="mb-2">{item.description}</p>
                          {item.mediaUrl && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openMedia(item.mediaUrl)}
                            >
                              View Media
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </Container>
      </Col>

      {/* Modal for media preview */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="text-center">
          {selectedMedia && selectedMedia.endsWith(".mp4") ? (
            <video width="100%" height="auto" controls>
              <source src={selectedMedia} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={selectedMedia} alt="Media" className="img-fluid rounded" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}

export default MemberDashboard;
