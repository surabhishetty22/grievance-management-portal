import React, { useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import './Complaint.css';

const Complaint = () => {
  const { userId } = useParams(); 
  const [complaint, setComplaint] = useState({
    description: "",
    date: "",
    image: null,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setComplaint({ ...complaint, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("description", complaint.description);
    formData.append("date", complaint.date);
    formData.append("image", complaint.image);

    Axios.post('http://localhost:3000/insert-complaint', formData)
      .then((response) => {
        alert("Complaint is registered");
        console.log(response.data);
        setIsSubmitting(false);
        setErrorMsg("");
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsSubmitting(false);
        setErrorMsg("Error submitting complaint. Please try again.");
      });
  };

  const currentDate = new Date();

  const minDate = new Date();
  minDate.setDate(currentDate.getDate() - 2);

  const minDateFormatted = minDate.toISOString().slice(0, 10);

  return (
    <div className="complaint-container">
      <h1 className="complaint-heading">Submit a Complaint</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={complaint.description}
          onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
          required
        />
        <input
          type="date"
          value={complaint.date}
          onChange={(e) => setComplaint({ ...complaint, date: e.target.value })}
          required
          min={minDateFormatted} 
          max={currentDate.toISOString().slice(0, 10)} 
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>Submit Complaint</button>
      </form>

      {errorMsg && <div className="complaint-error">{errorMsg}</div>}
    </div>
  );
}

export default Complaint;
