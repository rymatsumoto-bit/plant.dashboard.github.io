// ============================================
// ResultField.jsx - Layer 2: Result Textarea
// ============================================

export default function ResultField({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Results</label>
      <textarea
        name="result"
        value={value}
        onChange={onChange}
        rows={3}
        placeholder="e.g., recovered"
        className="form-input"
        style={{ resize: 'none' }}
      />
    </div>
  );
}