import { Link } from "react-router-dom";
import "./TagCloud.css";
import PropTypes from "prop-types";

const TagCloud = ({
  tags = [],
  title = "Tags",
  showCard = false,
  className = "",
}) => {
  const content = (
    <>
      {tags.length > 0 ? (
        <div className="tags">
          {tags.map((tag) => (
            <Link
              to={`/notebook/tags/${tag.id}`}
              key={tag.id}
              className="tag"
              style={{
                fontSize: `${Math.max(
                  0.8,
                  Math.min(2, 0.8 + (tag.count / 10) * 0.5)
                )}em`,
              }}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-message">No tags created yet</p>
      )}
    </>
  );

  // If showCard is false, just return the tags without a card wrapper
  if (!showCard) {
    return <div className={`tag-cloud ${className}`}>{content}</div>;
  }

  // Otherwise return with card styling (for use in other components)
  return (
    <div className={`card tag-cloud ${className}`}>
      <h2>{title}</h2>
      <div className="card-content">{content}</div>
    </div>
  );
};

TagCloud.propTypes = {
  tags: PropTypes.array,
  title: PropTypes.string,
  showCard: PropTypes.bool,
  className: PropTypes.string,
};

export default TagCloud;
