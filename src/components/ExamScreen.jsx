export default function ExamScreen({
  questions = [],
  currentQ,
  onSelectQuestion,
  answers,
  onAnswer,
  onSave,
  lastSaved,
  onSubmit,
  user,
}) {
  const answered = Object.values(answers).filter(a => a && a.trim()).length
  const currentQuestion = questions[currentQ] || {}

  return (
    <div className="exam-screen">
      {/* Invisible Watermarking */}
      <div className="watermark-overlay">
        {Array.from({ length: 150 }).map((_, i) => (
          <span key={i}>{user} — HOPE_OS_SECURE</span>
        ))}
      </div>

      {/* ── Question Navigator (Left Panel) ── */}
      <div className="question-nav">
        <div className="question-nav-header">
          <div className="question-nav-title">QUESTION NAVIGATOR</div>
          <div className="question-progress">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${
                  answers[i] && answers[i].trim() ? 'answered' : ''
                } ${currentQ === i ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="question-list">
          {questions.map((q, i) => {
            const isActive = currentQ === i
            const isAnswered = answers[i] && answers[i].trim()
            return (
              <div
                key={q.id}
                className={`question-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectQuestion(i)}
                id={`question-nav-${i}`}
              >
                <div className={`q-status-dot ${isAnswered ? 'answered' : 'unanswered'}`} />
                <div className="q-info">
                  <div className="q-label">Q{i + 1}</div>
                  <div className="q-text">{q.text}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Submit button at bottom of navigator */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            id="submit-exam"
            style={{
              width: '100%',
              fontSize: 10,
              letterSpacing: 3,
              padding: 12,
            }}
          >
            ■ SUBMIT EXAMINATION
          </button>
        </div>
      </div>

      {/* ── Answer Pane (Right Panel) ── */}
      <div className="answer-pane" style={{ paddingBottom: 50 }}>
        {/* Question display */}
        <div className="question-display">
          <div className="question-counter">
            QUESTION <span>{currentQ + 1}</span> / {questions.length}
            <span style={{
              float: 'right',
              color: 'var(--text-muted)',
            }}>
              {answered} answered
            </span>
          </div>
          <p className="question-full-text">{currentQuestion.text}</p>
          <div className="question-meta">
            <span className="question-meta-tag marks">
              {currentQuestion.marks} MARKS
            </span>
            <span className="question-meta-tag">
              {currentQuestion.topic.toUpperCase()}
            </span>
            <span className="question-meta-tag">
              {currentQuestion.difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Answer label */}
        <div className="answer-label">▶ YOUR RESPONSE:</div>

        {/* Answer Input */}
        {currentQuestion.type === 'mcq' ? (
          <div className="mcq-options">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQ] === opt;
              return (
                <div 
                  key={idx} 
                  className={`mcq-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onAnswer(currentQ, opt);
                  }}
                >
                  <div className="mcq-radio">
                    {isSelected && <div className="mcq-radio-inner" />}
                  </div>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <textarea
            className="answer-textarea"
            value={answers[currentQ] || ''}
            onChange={e => onAnswer(currentQ, e.target.value)}
            placeholder="Begin typing your answer here..."
            id={`answer-${currentQ}`}
          />
        )}

        {/* Save bar */}
        <div className="save-bar">
          <button
            className="btn btn-accent"
            onClick={onSave}
            id="save-response"
            style={{ letterSpacing: 2, fontWeight: 600, padding: '8px 22px' }}
          >
            SAVE RESPONSE
          </button>

          {lastSaved && (
            <span className="save-status">
              <span className="check">✓</span> Last saved: {lastSaved}
            </span>
          )}

          {/* Nav buttons */}
          <div className="nav-buttons">
            {currentQ > 0 && (
              <button
                className="btn btn-ghost"
                onClick={() => onSelectQuestion(currentQ - 1)}
                style={{ letterSpacing: 1 }}
              >
                ◂ PREV
              </button>
            )}
            {currentQ < questions.length - 1 && (
              <button
                className="btn btn-ghost"
                onClick={() => onSelectQuestion(currentQ + 1)}
                style={{ letterSpacing: 1 }}
              >
                NEXT ▸
              </button>
            )}
          </div>
        </div>

        {/* Word count */}
        {currentQuestion.type !== 'mcq' && (
          <div style={{
            marginTop: 12,
            fontSize: 10,
            color: 'var(--text-dim)',
            letterSpacing: 1,
          }}>
            WORDS: {(answers[currentQ] || '').split(/\s+/).filter(Boolean).length}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            CHARS: {(answers[currentQ] || '').length}
          </div>
        )}
      </div>
    </div>
  )
}
