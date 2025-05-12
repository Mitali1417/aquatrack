
  const options = ['Low', 'Medium', 'High'];
  
  const SeveritySelector = ({ value, onChange }) => {
    return (
      <div>
        <label className="block font-medium text-gray-700 mb-1">Severity</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select severity</option>
          {options.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default SeveritySelector;
  