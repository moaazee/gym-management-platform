import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Form,
  Modal,
  Table,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Sidebar.css";


const API = import.meta.env.VITE_API_URL;

const TrainerDashboard = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [programData, setProgramData] = useState({ title: "", description: "" });
  const [mealData, setMealData] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [mealFile, setMealFile] = useState(null);
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API}/users/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to load members", err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleMealFileChange = (e) => setMealFile(e.target.files[0]);

  const openTrainingModal = (member) => {
    setSelectedMember(member);
    setShowTrainingModal(true);
  };

  const openMealModal = (member) => {
    setSelectedMember(member);
    setShowMealModal(true);
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`${API}/users/members/${id}/toggle`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMembers();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleAssign = async (type) => {
    try {
      let uploadedUrl = null;
      const data = type === "training" ? file : mealFile;
      const body = type === "training" ? programData : mealData;
      const modalSetter = type === "training" ? setShowTrainingModal : setShowMealModal;

      if (data) {
        const formData = new FormData();
        formData.append("file", data);
        const uploadRes = await axios.post(`${API}/programs/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedUrl = uploadRes.data.url;
      }

      await axios.post(
        `${API}/programs/assign`,
        {
          ...body,
          userId: selectedMember.id,
          mediaUrl: uploadedUrl,
          type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(`${type === "training" ? "Training" : "Meal"} plan assigned!`);
      modalSetter(false);
      fetchMembers();

      if (type === "training") {
        setProgramData({ title: "", description: "" });
        setFile(null);
      } else {
        setMealData({ title: "", description: "" });
        setMealFile(null);
      }

      setTimeout(() => setSuccess(""), 4000); // Clear message after 4s
    } catch (err) {
      console.error("Assignment failed", err);
    }
  };

  return (
    <Row className="trainer-layout">
      <Col md={2} className="p-0">
        <Sidebar />
      </Col>

      <Col md={10}>
        <Container className="py-4">
          <h2 className="text-center mb-4">Trainer Dashboard</h2>

          {success && <Alert variant="success">{success}</Alert>}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Assign Training</th>
                <th>Assign Meals</th>
                <th>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <Button size="sm" onClick={() => openTrainingModal(m)}>
                      Training
                    </Button>
                  </td>
                  <td>
                    <Button size="sm" variant="info" onClick={() => openMealModal(m)}>
                      Meal Plan
                    </Button>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant={m.isActive ? "danger" : "success"}
                      onClick={() => toggleStatus(m.id)}
                    >
                      {m.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Col>

      {/* Training Modal */}
      <Modal show={showTrainingModal} onHide={() => setShowTrainingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Training to {selectedMember?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={programData.title}
              onChange={(e) => setProgramData({ ...programData, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={programData.description}
              onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Upload Media</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTrainingModal(false)}>Cancel</Button>
          <Button onClick={() => handleAssign("training")}>Assign</Button>
        </Modal.Footer>
      </Modal>

      {/* Meal Modal */}
      <Modal show={showMealModal} onHide={() => setShowMealModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Meal Plan to {selectedMember?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={mealData.title}
              onChange={(e) => setMealData({ ...mealData, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={mealData.description}
              onChange={(e) => setMealData({ ...mealData, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Upload Media</Form.Label>
            <Form.Control type="file" onChange={handleMealFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMealModal(false)}>Cancel</Button>
          <Button onClick={() => handleAssign("meal")}>Assign</Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default TrainerDashboard;
