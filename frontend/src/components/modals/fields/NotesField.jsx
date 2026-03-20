// ============================================
// NotesField.jsx - Layer 2: Notes Textarea
// ============================================

export default function NotesField({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Notes</label>
      <textarea
        name="notes"
        value={value}
        onChange={onChange}
        rows={3}
        placeholder="Optional notes about this activity..."
        className="form-input"
        style={{ resize: 'none' }}
      />
    </div>
  );
}