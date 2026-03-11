// ============================================
// DatePicker.jsx - Layer 2: Date Field
// ============================================

export default function DatePicker({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Date *</label>
      <input
        type="date"
        name="activity_date"
        value={value}
        onChange={onChange}
        className="form-input"
      />
    </div>
  );
}