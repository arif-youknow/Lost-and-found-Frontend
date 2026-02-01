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
      
      const result = await apiService.searchByToken(searchQuery, 2);
      
      if (result.status === "success") {
        setMatches(result.top_matches); 
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
            {loading ? <span className={styles.refreshBtn}>Searching...</span> : <span className={styles.refreshBtn}>Search</span>}
          </Button>
        </div>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {loading && <p>Loading matches...</p>}

      {!loading && matches.length === 0 && !error && (
        <p className={styles.noMatches}>No matches found yet. Try refreshing!</p>
      )}

      {!loading && matches.length > 0 && (
        <div className={styles.matchesList}>
          {matches.map((match, index) => (
            <div key={index} className={styles.matchCard}>
              
              <h3 className={styles.matchItemName}>
                {match.name} ({match.type === 'found' ? 'Found' : 'Lost'})
              </h3>
              <p className={styles.matchDescription}>{match.description}</p>
              <p className={styles.matchScore}>
                Match Score: <strong>{match.match_score}%</strong>
              </p>
              <Button 
                onClick={() => alert(`Viewing details for ${match.name}`)} 
                variant="secondary" 
                className={styles.viewDetailsButton}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindMatches;