import "../../css/loader.css";

export default function Loader({ message }) {
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="spinner"></div>
        <div className="loader-text">{message}</div>
      </div>
    </div>
  );
}
