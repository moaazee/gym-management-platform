import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Container, Table, Row, Col } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const MealPlanPage = () => {
  const [meals, setMeals] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${API}/programs/meal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(res.data);
    } catch (err) {
      console.error("Failed to load meals", err);
    }
  };

  return (
    <Row>
      <Col md={2} className="p-0">
        <Sidebar />
      </Col>
      <Col md={10}>
        <Container className="py-4">
          <h2 className="text-center mb-4">Assigned Meal Plans</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Member</th>
                <th>Title</th>
                <th>Description</th>
                <th>Media</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((m) => (
                <tr key={m.id}>
                  <td>{m.user?.name}</td>
                  <td>{m.title}</td>
                  <td>{m.description}</td>
                  <td>
                    {m.mediaUrl ? (
                      <a href={m.mediaUrl} target="_blank" rel="noreferrer">View</a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Col>
    </Row>
  );
};

export default MealPlanPage;
