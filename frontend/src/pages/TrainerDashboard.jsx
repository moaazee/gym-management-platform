import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Form,
  Modal,
  Table,
  Alert,
  Card,
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
  const [programData, setProgramData] = useState({ title: "", description: "", items: [] });
  const [mealData, setMealData] = useState({ title: "", description: "", items: [] });
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

  const handleItemChange = (type, index, field, value) => {
    const data = type === "training" ? [...programData.items] : [...mealData.items];
    data[index][field] = value;
    if (type === "training") {
      setProgramData({ ...programData, items: data });
    } else {
      setMealData({ ...mealData, items: data });
    }
  };

  const handleFileChange = (type, index, file) => {
    const data = type === "training" ? [...programData.items] : [...mealData.items];
    data[index].file = file;
    if (type === "training") {
      setProgramData({ ...programData, items: data });
    } else {
      setMealData({ ...mealData, items: data });
    }
  };

  const addItem = (type) => {
    const newItem = { title: "", description: "", file: null };
    if (type === "training") {
      setProgramData({ ...programData, items: [...programData.items, newItem] });
    } else {
      setMealData({ ...mealData, items: [...mealData.items, newItem] });
    }
  };

  const removeItem = (type, index) => {
    const items = type === "training" ? [...programData.items] : [...mealData.items];
    items.splice(index, 1);
    if (type === "training") {
      setProgramData({ ...programData, items });
    } else {
      setMealData({ ...mealData, items });
    }
  };

  const handleAssign = async (type) => {
    try {
      const data = type === "training" ? programData : mealData;
      const modalSetter = type === "training" ? setShowTrainingModal : setShowMealModal;

      const uploadedItems = [];

      for (const item of data.items) {
        let mediaUrl = "";
        if (item.file) {
          const formData = new FormData();
          formData.append("file", item.file);
          const uploadRes = await axios.post(`${API}/programs/upload`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          mediaUrl = uploadRes.data.url;
        }

        uploadedItems.push({
          title: item.title,
          description: item.description,
          mediaUrl,
        });
      }

      await axios.post(
        `${API}/programs/assign`,
        {
          title: data.title,
          description: data.description,
          userId: selectedMember.id,
          type,
          items: uploadedItems,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(`${type === "training" ? "Training" : "Meal"} plan assigned!`);
      modalSetter(false);
      fetchMembers();

      if (type === "training") {
        setProgramData({ title: "", description: "", items: [] });
      } else {
        setMealData({ title: "", description: "", items: [] });
      }

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Assignment failed", err);
    }
  };

  const renderModal = (type, showModal, setShowModal, data, setData) => (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Assign {type === "training" ? "Training" : "Meal"} to {selectedMember?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-2">
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </Form.Group>

          {data.items.map((item, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-light">
              <Form.Group className="mb-2">
                <Form.Label>Item Title</Form.Label>
                <Form.Control
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(type, index, "title", e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Item Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleItemChange(type, index, "description", e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Upload Media</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleFileChange(type, index, e.target.files[0])}
                />
              </Form.Group>
              <Button variant="outline-danger" size="sm" onClick={() => removeItem(type, index)}>
                Remove Item
              </Button>
            </div>
          ))}

          <Button onClick={() => addItem(type)} variant="secondary" className="mb-2 w-100">
            + Add Item
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
        <Button onClick={() => handleAssign(type)}>Assign</Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="d-flex trainer-layout">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="trainer-content flex-grow-1">
        <Container fluid className="py-4">
          <h2 className="text-center mb-4 fw-bold">Trainer Dashboard</h2>

          {success && <Alert variant="success">{success}</Alert>}

          <Card className="shadow-sm">
            <Card.Body>
              <Table bordered hover responsive>
                <thead className="table-dark">
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
                      <td>
                        <span className={`badge rounded-pill ${m.isActive ? "bg-success" : "bg-secondary"}`}>
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <Button size="sm" variant="primary" onClick={() => openTrainingModal(m)}>
                          Assign
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" variant="info" onClick={() => openMealModal(m)}>
                          Assign
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
            </Card.Body>
          </Card>
        </Container>
      </div>

      {renderModal("training", showTrainingModal, setShowTrainingModal, programData, setProgramData)}
      {renderModal("meal", showMealModal, setShowMealModal, mealData, setMealData)}
    </div>
  );
};

export default TrainerDashboard;
