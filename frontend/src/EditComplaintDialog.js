import React, { useState } from 'react';
import './EditComplaintDialog.css';

const EditComplaintDialog = ({ complaint, onClose, onSave }) => {
  const [updatedActionDescription, setUpdatedActionDescription] = useState(complaint.actionDescription);
  const [updatedDate, setUpdatedDate] = useState(new Date(complaint.date).toISOString().split('T')[0]);
  const [updatedStatus, setUpdatedStatus] = useState(complaint.status);
  const [updatedImage, setUpdatedImage] = useState(complaint.image);

  const handleSave = () => {
    const updatedComplaint = {
      actionDescription: updatedActionDescription,
      date: updatedDate,
      status: updatedStatus,
      image: updatedImage,
      complaintId: complaint.complaintId,
    };

    onSave(updatedComplaint);
  };

  return (
    <div className="edit-complaint-dialog-overlay">
      <div className="edit-complaint-dialog">
        <h3>Edit Complaint</h3>
        <label>Action Description:</label>
        <input
          type="text"
          value={updatedActionDescription}
          onChange={(e) => setUpdatedActionDescription(e.target.value)}
        />
        <label>Date:</label>
        <input
          type="date"
          value={updatedDate}
          onChange={(e) => setUpdatedDate(e.target.value)}
        />
        <label>Status:</label>
        <select
          value={updatedStatus}
          onChange={(e) => setUpdatedStatus(e.target.value)}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setUpdatedImage(e.target.files[0])}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditComplaintDialog;
