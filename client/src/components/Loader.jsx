const Loader = ({ label = 'Loading your tasks...' }) => (
  <div className="loaderWrap" role="status" aria-live="polite">
    <span className="loader" />
    <p>{label}</p>
  </div>
);

export default Loader;
