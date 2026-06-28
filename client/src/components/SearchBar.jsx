import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => (
  <div className="searchBar">
    <FiSearch />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by title or description"
      aria-label="Search tasks"
    />
    {value ? (
      <button type="button" onClick={() => onChange('')} aria-label="Clear search">
        <FiX />
      </button>
    ) : null}
  </div>
);

export default SearchBar;
