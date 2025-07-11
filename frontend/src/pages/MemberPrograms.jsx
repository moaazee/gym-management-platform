import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Card, Spinner, Badge, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const MemberPrograms = () => {
  const [key, setKey] = useState("new");
  const [newPrograms, setNewPrograms] = useState([]);
  const [oldPrograms, setOldPrograms] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const memberId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${API}/programs/member/${memberId}/programs`);
        setNewPrograms(res.data.newPrograms || []);
        setOldPrograms(res.data.oldPrograms || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [memberId]);

  const renderProgramItems = (items) => {
    if (!items || items.length === 0) return <p className="text-muted">No items</p>;
    return items.map((item, i) => (
      <div key={i} className="mb-3">
        <h6>{item.title || "Untitled"}</h6>
        <p>{item.description || "No description"}</p>
        {item.mediaUrl && (
          <img
            src={item.mediaUrl}
            alt={item.title}
            style={{ maxWidth: "150px", borderRadius: "6px" }}
          />
        )}
      </div>
    ));
  };

  const renderPrograms = (programs, isNew) => {
    const filtered = programs.filter((p) =>
      filterType ? p.type === filterType : true
    );

    return filtered.length ? filtered.map((prog, idx) => (
      <Card key={idx} className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>
              {prog.type === "MEAL" ? "MEAL PROGRAM: " : "TRAINING PROGRAM: "}
              {prog.title}
            </Card.Title>
            {isNew && <Badge bg="warning" text="dark">NEW</Badge>}
          </div>
          <Card.Subtitle className="mb-2 text-muted">{prog.type}</Card.Subtitle>
          <Card.Text>{prog.description}</Card.Text>
          {prog.startDate && prog.endDate && (
            <p className="text-muted">
              <strong>🗓 Duration:</strong>{" "}
              {new Date(prog.startDate).toLocaleDateString()} →{" "}
              {new Date(prog.endDate).toLocaleDateString()}
            </p>
          )}
          <hr />
          <div>
            <strong>Program Items:</strong>
            <div className="mt-2">{renderProgramItems(prog.programItems)}</div>
          </div>
        </Card.Body>
      </Card>
    )) : <p className="text-muted">No programs to show.</p>;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">My Assigned Programs</h2>

      {/* Filter Dropdown */}
      <Row className="justify-content-end mb-3">
        <Col xs={12} sm={6} md={4}>
          <Form.Select
            aria-label="Filter by type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="shadow-sm"
          >
            <option value="">🔎 Filter: All Program Types</option>
            <option value="TRAINING">Training</option>
            <option value="MEAL">Meal</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Tabs for New / Past */}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4" justify>
        <Tab eventKey="new" title="🆕 New Programs">
          {renderPrograms(newPrograms, true)}
        </Tab>
        <Tab eventKey="old" title="📁 Past Programs">
          {renderPrograms(oldPrograms, false)}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MemberPrograms;
