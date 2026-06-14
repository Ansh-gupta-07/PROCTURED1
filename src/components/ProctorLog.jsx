export default function ProctorLog({ shots, onClose }) {
  return (
    <div className="proctor-overlay">
      <div className="proctor-header">
        <h3 className="proctor-title">
          PROCTOR CAPTURE LOG — {shots.length} CAPTURE{shots.length !== 1 ? 'S' : ''}
        </h3>
        <button className="btn btn-ghost" onClick={onClose} id="close-proctor-log">
          ✕ CLOSE
        </button>
      </div>

      <div className="proctor-grid">
        {shots.length === 0 ? (
          <p className="proctor-empty">
            No captures yet. Screenshots are recorded automatically every
            60 seconds during the examination. This is a simulated proctoring
            log for the prototype demo.
          </p>
        ) : (
          shots.map((shot, i) => (
            <div key={i} className="proctor-capture">
              <img
                src={shot.dataUrl}
                alt={`Capture ${i + 1}`}
              />
              <div className="time">
                CAPTURE #{i + 1} — {shot.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
