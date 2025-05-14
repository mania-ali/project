import React, { useState } from 'react';
import axios from 'axios';

const MovieManagement = () => {
  const [movieData, setMovieData] = useState({
    MovieID: '',
    Title: '',
    Genre: '',
    Rating: '',
    Synopsis: '',
    Duration: '',
    Cast: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/movies', movieData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.message || 'Movie saved successfully');
      setMovieData({
        MovieID: '',
        Title: '',
        Genre: '',
        Rating: '',
        Synopsis: '',
        Duration: '',
        Cast: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.error || 'Failed to save movie'}`);
    }
  };

  return (
    <div className="movie-management">
      <h2>Add/Edit Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Movie ID (leave empty for new movie):</label>
          <input type="number" name="MovieID" value={movieData.MovieID} onChange={handleChange} />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" name="Title" value={movieData.Title} onChange={handleChange} required />
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" name="Genre" value={movieData.Genre} onChange={handleChange} required />
        </div>
        <div>
          <label>Rating:</label>
          <input type="number" step="0.1" name="Rating" value={movieData.Rating} onChange={handleChange} required />
        </div>
        <div>
          <label>Synopsis:</label>
          <textarea name="Synopsis" value={movieData.Synopsis} onChange={handleChange} required />
        </div>
        <div>
          <label>Duration (minutes):</label>
          <input type="number" name="Duration" value={movieData.Duration} onChange={handleChange} required />
        </div>
        <div>
          <label>Cast (comma separated):</label>
          <input type="text" name="Cast" value={movieData.Cast} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MovieManagement;