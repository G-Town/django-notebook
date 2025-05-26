import styles from "./Card.module.css";
import PropTypes from "prop-types";

const Card = ({ title, className, children }) => {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      {title && <h2>{title}</h2>}
      <div className="card-content">{children}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
