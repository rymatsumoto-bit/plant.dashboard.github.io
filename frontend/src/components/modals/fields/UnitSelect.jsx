// ============================================
// UnitSelect.jsx - Layer 2: Unit Field
// ============================================
// Renders a dropdown when free, or a static label
// when locked (e.g. Watering locks this to '%').
// ============================================

const UNIT_OPTIONS = [
  { value: '%',     label: 'Percentage (%)' },
  { value: 'ml',    label: 'Milliliters (ml)' },
  { value: 'oz',    label: 'Ounces (oz)' },
  { value: 'cups',  label: 'Cups' },
  { value: 'grams', label: 'Grams (g)' },
  { value: 'tsp',   label: 'Teaspoons (tsp)' },
];

export default function UnitSelect({ value, onChange, disabled = false }) {
  const selectedUnit = UNIT_OPTIONS.find((u) => u.value === value);

  return (
    <div className="form-group">
      <label className="form-label">Unit</label>

      {disabled ? (
        <>
          <div className="form-static-value">
            {selectedUnit?.label || value}
          </div>
          <input type="hidden" name="unit" value={value} />
        </>
      ) : (
        <select
          name="unit"
          value={value}
          onChange={onChange}
          className="form-input"
        >
          <option value="">Select unit...</option>
          {UNIT_OPTIONS.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}