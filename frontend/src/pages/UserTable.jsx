import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import AssignProgramModal from "./AssignProgramModal";
import AssignMealModal from "./AssignMealModal";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Assign Program</th>
            <th>Assign Meal Plan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            user.role === "MEMBER" ? (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <Button onClick={() => {
                    setSelectedUser(user);
                    setShowProgramModal(true);
                  }}>Assign</Button>
                </td>
                <td>
                  <Button variant="success" onClick={() => {
                    setSelectedUser(user);
                    setShowMealModal(true);
                  }}>Assign</Button>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </Table>

      <AssignProgramModal
        show={showProgramModal}
        onHide={() => setShowProgramModal(false)}
        user={selectedUser}
      />
      <AssignMealModal
        show={showMealModal}
        onHide={() => setShowMealModal(false)}
        user={selectedUser}
      />
    </>
  );
};

export default UserTable;
