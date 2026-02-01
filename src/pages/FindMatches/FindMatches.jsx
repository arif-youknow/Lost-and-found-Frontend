import { useState } from 'react';
import styles from './FindMatches.module.css';
import Button from '../../components/Button/Button';
import apiService from '../../Services/ApiServices';

const FindMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery) return alert("Please enter a token");

    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.searchByToken(searchQuery, 4); // ৪টি দিলাম যেন ২টা রো পূর্ণ হয়
      if (result.status === "success") {
        const confirmedMatches = result.top_matches.filter(m => m.is_match === true);
        setMatches(confirmedMatches);
      }
    } catch (err) {
      console.error('Search failed', err);
      setError(err.message || 'Something went wrong');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.matchesContainer}>
      <h2 className={styles.title}>Find Your Matches</h2>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Enter your token"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.actions}>
          <Button onClick={handleSearch} disabled={loading} variant="primary">
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {loading && <p className={styles.statusMessage}>Loading matches...</p>}

      {!loading && matches.length === 0 && !error && searchQuery && (
        <p className={styles.noMatches}>No confirmed matches found yet.</p>
      )}

      <div className={styles.matchesGrid}>
        {matches.map((match, index) => (
          <div key={index} className={styles.horizontalCard}>
            {/* বাম দিকে ছবি */}
            <div className={styles.imageSection}>
              {match.image_url ? (
                <img src={`http://127.0.0.1:8000${match.image_url}`} alt="Item" />
              ) : (
                <div className={styles.noPhoto}>No Photo</div>
              )}
            </div>

            {/* ডান দিকে তথ্য */}
            <div className={styles.infoSection}>
              <p><strong>Item Name:</strong> {match.item_name}</p>
              <p className={styles.descText}><strong>Description:</strong> {match.description}</p>
              <p><strong>Match Score:</strong> <span className={styles.scoreText}>{match.confidence}%</span></p>
              <p><strong>Contact No:</strong> {match.contact_info}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindMatches;