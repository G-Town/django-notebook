import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card";
import TagCloud from "../TagCloud";
import { addQuickNote, getActivityIcon } from "../../services/dashService";
import styles from "./Dashboard.module.css";
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
    <div className={styles.dashContent}>
      {/* Column 1 */}
      <div className={styles.dashColumn}>
        <Card title="Quick Actions" className={styles.quickActions}>
          <div className={styles.buttonGroup}>
            <Link to="/notebook/new/" className={styles.btn}>
              New Note
            </Link>
            <Link to="/notebook/import/" className={styles.btn}>
              Import
            </Link>
          </div>
        </Card>

        <Card title="Quick Add Note" className={styles.quickAddNote}>
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Type your note here..."
            disabled={isAdding}
          ></textarea>
          <button
            onClick={handleQuickNoteAdd}
            className={styles.btn}
            disabled={isAdding || !quickNote.trim()}
          >
            {isAdding ? "Adding..." : "Add Note"}
          </button>
        </Card>

        <Card title="Pinned Items" className={styles.pinnedItems}>
          {pinnedItems.length > 0 ? (
            <ul>
              {pinnedItems.map((item) => (
                <li key={item.id}>
                  <span className={styles.pinIcon}>📌</span>
                  <Link to={`/notebook/${item.type}/${item.id}`}>
                    {item.title || item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>No pinned items yet</p>
          )}
        </Card>
      </div>

      {/* Column 2 */}
      <div className={styles.dashColumn}>
        <Card title="Recent Notes" className={styles.recentNotes}>
          {recentNotes.length > 0 ? (
            <>
              <ul>
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <Link to={`/notebook/note/${note.id}`}>
                      <h3>{note.title}</h3>
                      <p className={styles.noteSnippet}>{note.snippet}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/notebook/notes/" className={styles.viewMore}>
                View More
              </Link>
            </>
          ) : (
            <p className={styles.emptyMessage}>No recent notes</p>
          )}
        </Card>

        <Card title="Featured Folders" className={styles.featuredFolders}>
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
              <Link to="/notebook/folders/" className={styles.viewMore}>
                View More
              </Link>
            </>
          ) : (
            <p className={styles.emptyMessage}>No featured folders</p>
          )}
        </Card>

        <Card title="Statistics" className={styles.statistics}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Notes: </span>
            <span className={styles.statValue}>{user.noteCount || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Folders: </span>
            <span className={styles.statValue}>{user.folderCount || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Tags: </span>
            <span className={styles.statValue}>{user.tagCount || 0}</span>
          </div>
        </Card>
      </div>

      {/* Column 3 */}
      <div className={styles.dashColumn}>
        <Card title="Tips" className={styles.userTips}>
          <p>Did you know you can organize your notes with tags?</p>
        </Card>

        <Card title="Activity Feed" className={styles.activityFeed}>
          {activityFeed.length > 0 ? (
            <ul>
              {activityFeed.map((activity) => (
                <li key={activity.id}>
                  <span className={styles.activityIcon}>
                    {getActivityIcon(activity.type)}
                  </span>
                  <span className={styles.activityText}>{activity.description}</span>
                  <span className={styles.activityTime}>{activity.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>No recent activity</p>
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
