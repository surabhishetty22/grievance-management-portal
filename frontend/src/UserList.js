import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
  const [complaints, setComplaints] = useState([]);
  const { userId } = useParams();

  const [clickedImage, setClickedImage] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/fields/${userId}`)
      .then((response) => {
        setComplaints(response.data);
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
      });
  }, [userId]);

  const handleViewImage = (complaint) => {
    setClickedImage(complaint);
  };

  return (
    <div className="user-list-container">
      <table>
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Action Description</th>
            <th>Date</th>
            <th>Status</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.complaintId}>
              <td>{complaint.complaintId}</td>
              <td>{complaint.actionDescription}</td>
              <td>{complaint.date}</td>
              <td>{complaint.status}</td>
              <td>
                <button onClick={() => handleViewImage(complaint)}>View Image</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clickedImage && (
        <div className="image-modal" onClick={() => setClickedImage(null)}>
          <img
            src={`data:${clickedImage.image.contentType};base64,${clickedImage.image.data}`}
            alt="Clicked Complaint"
          />
        </div>
      )}
    </div>
  );
};

export default UserList;
