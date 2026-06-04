function ProgressBar({ progress }) {
  return (
    <div className="progress custom-progress">
  <div
    className="progress-bar custom-progress-bar"
    style={{ width: `${progress}%` }}
  />
</div>
  );
}

export default ProgressBar;