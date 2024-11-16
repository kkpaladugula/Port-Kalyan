import React, { useState, useEffect } from "react";
import "../NasaProject/Nasa.css";

const Nasa = () => {
  const [imageData, setImageData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  const apiKey = "cbXGhNU14iewaobY2vpRzFvfZeLsLGWVVs9YgbhP";

  // Fetch the current image of the day when the component mounts
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    fetchImageOfTheDay(currentDate);
    loadSearchHistory();
  }, []);

  // Fetch image data for a given date
  const fetchImageOfTheDay = (date) => {
    setError(""); // Clear previous errors
    setImageData(null); // Clear previous image data
    fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.media_type !== "image") {
          throw new Error("No image available for the selected date");
        }
        setImageData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    // Check if the selected date is valid
    if (selectedDate > currentDate) {
      setError("Invalid date selection. Please choose a date on or before the current date.");
      return;
    }

    fetchImageOfTheDay(selectedDate);
    saveSearchHistory(selectedDate);
  };

  // Save the search history to localStorage
  const saveSearchHistory = (date) => {
    if (!searchHistory.includes(date)) {
      const updatedHistory = [...searchHistory, date];
      setSearchHistory(updatedHistory);
      localStorage.setItem("searches", JSON.stringify(updatedHistory));
    }
  };

  // Load search history from localStorage
  const loadSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem("searches")) || [];
    setSearchHistory(history);
  };

  // Handle clicking a date from search history
  const handleHistoryClick = (date) => {
    fetchImageOfTheDay(date);
  };

  return (
    <div className="container">
      <h1>NASA Astronomy Picture of the Day</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split("T")[0]}
        />
        <button type="submit">Search</button>
      </form>

      {/* Error Display */}
      {error && <div className="error">{error}</div>}

      {/* Main Content */}
      <div className="main-content">
        {/* Image Section */}
        <div className="image-container">
          {imageData ? (
            <>
              <h2>{imageData.title}</h2>
              <img src={imageData.url} alt={imageData.title} />
              <p>{imageData.explanation}</p>
            </>
          ) : (
            !error && <p>Loading...</p>
          )}
        </div>

        {/* Search History */}
        <div className="search-history">
          <h3>Search History</h3>
          <ul>
            {searchHistory.map((date, index) => (
              <li key={index}>
                <button onClick={() => handleHistoryClick(date)}>{date}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nasa;
