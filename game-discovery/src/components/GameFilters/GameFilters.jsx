/* eslint-disable react/prop-types */
import './GameFilters.css'

const genreOptions = [
  { value: '4', label: 'Action' },
  { value: '3', label: 'Adventure' },
  { value: '5', label: 'RPG' },
  { value: '10', label: 'Strategy' },
  { value: '2', label: 'Shooter' },
  { value: '7', label: 'Puzzle' },
]

const platformOptions = [
  { value: '4', label: 'PC' },
  { value: '18', label: 'PlayStation 4' },
  { value: '187', label: 'PlayStation 5' },
  { value: '1', label: 'Xbox One' },
  { value: '186', label: 'Xbox Series X/S' },
  { value: '7', label: 'Nintendo Switch' },
]

const orderingOptions = [
  { value: '-rating', label: 'Highest rated' },
  { value: '-released', label: 'Newest releases' },
  { value: 'released', label: 'Oldest releases' },
  { value: 'name', label: 'Name A-Z' },
]

function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <div className="game-filters__field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
      >
        <option value="">All {label.toLowerCase()} options</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function GameFilters({ filters, onChange }) {
  const activeFilters = [
    filters.genre && 'Genre selected',
    filters.platform && 'Platform selected',
    filters.ordering && 'Custom order',
  ].filter(Boolean)

  return (
    <section className="game-filters" aria-labelledby="game-filters-title">
      <div className="game-filters__header">
        <h2 id="game-filters-title">Browse games</h2>
        <p aria-live="polite">
          {activeFilters.length > 0
            ? `Active filters: ${activeFilters.join(', ')}`
            : 'Showing all games'}
        </p>
      </div>
      <div className="game-filters__controls">
        <FilterSelect
          id="genre"
          label="Genre"
          value={filters.genre}
          options={genreOptions}
          onChange={onChange}
        />
        <FilterSelect
          id="platform"
          label="Platform"
          value={filters.platform}
          options={platformOptions}
          onChange={onChange}
        />
        <FilterSelect
          id="ordering"
          label="Sort"
          value={filters.ordering}
          options={orderingOptions}
          onChange={onChange}
        />
      </div>
    </section>
  )
}

export default GameFilters
