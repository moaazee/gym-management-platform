import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Container, Table, Row, Col } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`${API}/programs/training`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(res.data);
    } catch (err) {
      console.error("Failed to load programs", err);
    }
  };

  return (
    <Row>
      <Col md={2} className="p-0">
        <Sidebar />
      </Col>
      <Col md={10}>
        <Container className="py-4">
          <h2 className="text-center mb-4">Assigned Training Programs</h2>
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
              {programs.map((p) => (
                <tr key={p.id}>
                  <td>{p.user?.name}</td>
                  <td>{p.title}</td>
                  <td>{p.description}</td>
                  <td>
                    {p.mediaUrl ? (
                      <a href={p.mediaUrl} target="_blank" rel="noreferrer">View</a>
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

export default ProgramPage;
