import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ComplaintList.css';
import EditComplaintDialog from './EditComplaintDialog';

const ComplaintList = () => {
  const { department } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [clickedImage, setClickedImage] = useState(null);

  useEffect(() => {
    if (department && department !== 'Unknown Department') {
      axios.get(`http://localhost:3000/complaint-list?department=${department}`)
        .then((response) => {
          setComplaints(response.data);
        })
        .catch((error) => {
          console.error('Error fetching complaints:', error);
        });
    }
  }, [department]);

  const handleCloseEditDialog = () => {
    setSelectedComplaint(null);
  };

  const handleSaveComplaint = (updatedComplaint) => {
    const formData = new FormData();

    formData.append('complaintId', updatedComplaint.complaintId);
    formData.append('actionDescription', updatedComplaint.actionDescription);
    formData.append('date', updatedComplaint.date);
    formData.append('status', updatedComplaint.status);
    formData.append('image', updatedComplaint.image); 

    axios.put(`http://localhost:3000/update-complaint/${updatedComplaint.complaintId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Complaint updated successfully:', response.data);
        const updatedComplaints = complaints.map((complaint) => {
          if (complaint.complaintId === updatedComplaint.complaintId) {
            return response.data.complaint;
          }
          return complaint;
        });
        setComplaints(updatedComplaints);
      })
      .catch((error) => {
        console.error('Error updating complaint:', error);
      });

    setSelectedComplaint(null);
  };

  const handleImageClick = (complaint) => {
    setClickedImage(complaint);
  };

  return (
    <div>
      <h1>User Complaints</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>description</th>
              <th>location</th>
              <th>Date</th>
              <th>Image</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.complaintId}>
                <td>{complaint.complaintId}</td>
                <td>{complaint.description}</td>
                <td>{complaint.city}</td>

                <td>{complaint.date}</td>

                <td>
                  {complaint.image ? (
                    <div>
                      <button onClick={() => handleImageClick(complaint)}>View Image</button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const updatedComplaint = { ...complaint };
                          updatedComplaint.imageFile = file;
                          handleSaveComplaint(updatedComplaint);
                        }}
                      />
                    </div>
                  )}
                </td>
                <td>{complaint.status}</td>
                <td>
                  <button onClick={() => setSelectedComplaint(complaint)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedComplaint && (
        <EditComplaintDialog
          complaint={selectedComplaint}
          onClose={handleCloseEditDialog}
          onSave={handleSaveComplaint}
        />
      )}
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

export default ComplaintList;
