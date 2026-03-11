// ============================================
// QuantifierInput.jsx - Layer 2: Quantity Field (free input)
// ============================================
// Used by generic NewActivityModal.
// WateringModal uses WateringLevelSelect instead.
// ============================================

export default function QuantifierInput({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Quantity</label>
      <input
        type="number"
        name="quantifier"
        value={value}
        onChange={onChange}
        step="0.01"
        placeholder="e.g., 250"
        className="form-input"
      />
    </div>
  );
}