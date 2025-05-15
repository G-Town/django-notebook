import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card";
import TagCloud from "../TagCloud";
import { addQuickNote, getActivityIcon } from "../../services/dashService";
import "./Dashboard.css";
import PropTypes from 'prop-types';

const Dashboard = ({
  user,
  recentNotes,
  featuredFolders,
  pinnedItems,
  activityFeed,
  tags,
  onNoteAdded,
  // refreshData,
}) => {
  const [quickNote, setQuickNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickNoteAdd = async () => {
    if (!quickNote.trim()) return;

    try {
      setIsAdding(true);
      const newNote = await addQuickNote(quickNote);
      setQuickNote("");

      if (onNoteAdded) {
        onNoteAdded(newNote);
      }
    } catch (error) {
      console.error("Error adding note:", error);
      // Could add error handling UI here
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="dash-content">
      {/* Column 1 */}
      <div className="dash-column">
        <Card title="Quick Actions" className="quick-actions">
          <div className="button-group">
            <Link to="/notebook/new/" className="btn">
              New Note
            </Link>
            <Link to="/notebook/import/" className="btn">
              Import
            </Link>
          </div>
        </Card>

        <Card title="Quick Add Note" className="quick-add-note">
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Type your note here..."
            disabled={isAdding}
          ></textarea>
          <button
            onClick={handleQuickNoteAdd}
            className="btn"
            disabled={isAdding || !quickNote.trim()}
          >
            {isAdding ? "Adding..." : "Add Note"}
          </button>
        </Card>

        <Card title="Pinned Items" className="pinned-items">
          {pinnedItems.length > 0 ? (
            <ul>
              {pinnedItems.map((item) => (
                <li key={item.id}>
                  <span className="pin-icon">📌</span>
                  <Link to={`/notebook/${item.type}/${item.id}`}>
                    {item.title || item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No pinned items yet</p>
          )}
        </Card>
      </div>

      {/* Column 2 */}
      <div className="dash-column">
        <Card title="Recent Notes" className="recent-notes">
          {recentNotes.length > 0 ? (
            <>
              <ul>
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <Link to={`/notebook/note/${note.id}`}>
                      <h3>{note.title}</h3>
                      <p className="note-snippet">{note.snippet}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/notebook/notes/" className="view-more">
                View More
              </Link>
            </>
          ) : (
            <p className="empty-message">No recent notes</p>
          )}
        </Card>

        <Card title="Featured Folders" className="featured-folders">
          {featuredFolders.length > 0 ? (
            <>
              <ul>
                {featuredFolders.map((folder) => (
                  <li key={folder.id}>
                    <Link to={`/notebook/folder/${folder.id}`}>
                      {folder.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/notebook/folders/" className="view-more">
                View More
              </Link>
            </>
          ) : (
            <p className="empty-message">No featured folders</p>
          )}
        </Card>

        <Card title="Statistics" className="statistics">
          <div className="stat-item">
            <span className="stat-label">Notes: </span>
            <span className="stat-value">{user.noteCount || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Folders: </span>
            <span className="stat-value">{user.folderCount || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tags: </span>
            <span className="stat-value">{user.tagCount || 0}</span>
          </div>
        </Card>
      </div>

      {/* Column 3 */}
      <div className="dash-column">
        <Card title="Tips" className="user-tips">
          <p>Did you know you can organize your notes with tags?</p>
        </Card>

        <Card title="Activity Feed" className="activity-feed">
          {activityFeed.length > 0 ? (
            <ul>
              {activityFeed.map((activity) => (
                <li key={activity.id}>
                  <span className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </span>
                  <span className="activity-text">{activity.description}</span>
                  <span className="activity-time">{activity.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No recent activity</p>
          )}
        </Card>

        <Card title="Tags">
          <TagCloud tags={tags} />
        </Card>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  recentNotes: PropTypes.array,
  featuredFolders: PropTypes.array,
  pinnedItems: PropTypes.array,
  activityFeed: PropTypes.array,
  tags: PropTypes.array,
  onNoteAdded: PropTypes.func,
  refreshData: PropTypes.func
};

export default Dashboard;
