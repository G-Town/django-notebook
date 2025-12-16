import { useEffect, useState } from "react";
import {
  fetchHomeData,
  searchItems,
  clearHomeDataCache,
} from "../../services/homeService";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import UserForm from "../../components/UserForm";
import SearchBar from "../../components/SearchBar";
import Dashboard from "../../components/Dashboard";
import LoadingIndicator from "../../components/Loading";
import "./Home.css";

const Home = () => {

  const { isAuthenticated } = useContext(AuthContext);

  // Single data state object to manage all home data
  const [homeData, setHomeData] = useState({
    user: {},
    recentNotes: [],
    featuredFolders: [],
    pinnedItems: [],
    activityFeed: [],
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHomeData();
      setHomeData(data);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading home data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setLoading(true);
      const results = await searchItems(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNoteAdded = () => {
    // Clear cache and reload all data when a note is added
    clearHomeDataCache();
    loadAllData();
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h1>Welcome to NotesApp</h1>
        <p>Please login to continue</p>
        <UserForm route="/api/token/" method="login" />
      </div>
    );
  }

  if (loading && !homeData.user.name) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container">
      <header className="welcome-header">
        <h1>Welcome back, {homeData.user.name || "User"}!</h1>
      </header>

      <SearchBar onSearch={handleSearch} />

      {error && <div className="error-message">{error}</div>}

      {searchResults ? (
        <div className="search-results">
          <h2>Search Results</h2>
          {/* Render search results here */}
          <button onClick={() => setSearchResults(null)}>Clear Results</button>
        </div>
      ) : (
        <Dashboard
          user={homeData.user}
          recentNotes={homeData.recentNotes}
          featuredFolders={homeData.featuredFolders}
          pinnedItems={homeData.pinnedItems}
          activityFeed={homeData.activityFeed}
          tags={homeData.tags}
          onNoteAdded={handleNoteAdded}
          refreshData={loadAllData}
        />
      )}
    </div>
  );
};

export default Home;
