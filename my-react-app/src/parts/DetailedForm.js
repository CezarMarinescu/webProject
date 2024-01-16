import React from "react";

const DetailedForm = ({ isDetailedFormOpen, selectedName, setSelectedName, setDetailedFormOpen }) => {
    if (!isDetailedFormOpen) {
      return null;
    }
  
    return (
      <div className="detailed-form-overlay">
        <div className="detailed-form-wrapper">
          <div className="header">
            <h2>Detailed Form</h2>
          </div>
          <div>
            <label htmlFor="selectedName">Select Name:</label>
            <select
              id="selectedName"
              name="selectedName"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            >
              {/* Predefined list of names */}
              <option value="Walter">Wasslter</option>
              <option value="Jade">Jade</option>
              {/* Add more names as needed */}
            </select>
          </div>
          {/* Add other detailed form content here */}
          <button className="create-btn" type="submit">Submit</button>
          <button className="close-btn" onClick={() => setDetailedFormOpen(false)}>Cancel</button>
        </div>
      </div>
    );
  };

export default DetailedForm;