import { useEffect, useState } from "react";
import api from "../api";
import {
  Container,
  Card,
  Row,
  Col,
  Modal,
  Button,
  Tabs,
  Tab,
  Badge,
  Form,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "../styles/MemberDashboard.css";

function MemberDashboard() {
  const [newPrograms, setNewPrograms] = useState([]);
  const [oldPrograms, setOldPrograms] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [filterType, setFilterType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get(`/programs/member/${user.id}/programs`);
        setNewPrograms(res.data.newPrograms || []);
        setOldPrograms(res.data.oldPrograms || []);
      } catch (err) {
        console.error("Failed to load programs:", err);
      }
    };
    fetchPrograms();
  }, [user.id]);

  const openMedia = (url) => {
    setSelectedMedia(url);
    setShowModal(true);
  };

  const renderProgramItems = (items) =>
    items?.map((item, idx) => (
      <Card key={idx} className="program-item-card mb-3">
        <Card.Body>
          <h6 className="fw-bold">{item.title || "Untitled Item"}</h6>
          <p className="text-muted">{item.description || "No description"}</p>
          {item.mediaUrl && (
            <Button variant="primary" size="sm" onClick={() => openMedia(item.mediaUrl)}>
              View Media
            </Button>
          )}
        </Card.Body>
      </Card>
    ));

  const filterPrograms = (programs) =>
    filterType ? programs.filter((p) => p.type === filterType) : programs;

  const renderPrograms = (programs, showBadge) =>
    filterPrograms(programs).length > 0 ? (
      filterPrograms(programs).map((program) => (
        <Card key={program.id} className="program-card shadow-sm mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center bg-light">
            <span className="fw-semibold text-uppercase">
              {program.type} Program: {program.title}
            </span>
            {showBadge && <Badge bg="warning" text="dark">NEW</Badge>}
          </Card.Header>
          <Card.Body>
            <p>{program.description}</p>
            {program.startDate && program.endDate && (
              <p className="text-muted mb-3">
                📅 {new Date(program.startDate).toLocaleDateString()} →{" "}
                {new Date(program.endDate).toLocaleDateString()}
              </p>
            )}
            {renderProgramItems(program.programItems || [])}
          </Card.Body>
        </Card>
      ))
    ) : (
      <p className="text-muted">No programs to display.</p>
    );

  return (
    <Row className="member-dashboard-layout">
      <Col md={2} className="p-0">
        <Sidebar />
      </Col>

      <Col md={10} className="member-content-wrapper">
        {/* Sticky Header */}
        <div className="sticky-header">
          <h2 className="text-center mb-3">My Assigned Programs</h2>

          {/* Filter Dropdown */}
          <Row className="mb-3 justify-content-end">
            <Col xs={12} sm={6} md={4}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="">🔍 Filter: All Program Types</option>
                <option value="TRAINING">Training</option>
                <option value="MEAL">Meal</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="program-tabs"
          >
            <Tab eventKey="new" title="🆕 New Programs" />
            <Tab eventKey="old" title="📁 Past Programs" />
          </Tabs>
        </div>

        {/* Scrollable Programs Area */}
        <div className="programs-scroll-area px-3">
          {activeTab === "new"
            ? renderPrograms(newPrograms, true)
            : renderPrograms(oldPrograms, false)}
        </div>
      </Col>

      {/* Media Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="text-center">
          {selectedMedia?.endsWith(".mp4") ? (
            <video width="100%" controls>
              <source src={selectedMedia} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={selectedMedia} alt="Program Media" className="img-fluid rounded" />
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
