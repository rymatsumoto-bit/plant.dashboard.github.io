// ============================================
// WateringLevelSelect.jsx - Layer 2: Watering Level Field
// ============================================
// Watering-specific dropdown replacing the free
// number QuantifierInput for the WateringModal.
// ============================================

const WATERING_LEVELS = [
  { value: '25',  label: 'MINIMAL (25%)' },
  { value: '50',  label: 'HALF (50%)' },
  { value: '75',  label: 'ALMOST FULL (75%)' },
  { value: '100', label: 'FULL (100%)' },
];

export default function WateringLevelSelect({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Watering Level *</label>
      <select
        name="quantifier"
        value={value}
        onChange={onChange}
        className="form-input"
      >
        <option value="">Select watering level...</option>
        {WATERING_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
    </div>
  );
}