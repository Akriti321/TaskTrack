const statuses = ['All', 'Pending', 'In Progress', 'Completed'];
const priorities = ['All', 'Low', 'Medium', 'High'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

const FilterBar = ({ filters, onChange }) => (
  <div className="filterBar">
    <label>
      Status
      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
      >
        {statuses.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </label>

    <label>
      Priority
      <select
        value={filters.priority}
        onChange={(event) => onChange({ ...filters, priority: event.target.value })}
      >
        {priorities.map((priority) => (
          <option key={priority}>{priority}</option>
        ))}
      </select>
    </label>

    <label>
      Sort
      <select
        value={filters.sort}
        onChange={(event) => onChange({ ...filters, sort: event.target.value })}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default FilterBar;
