/* eslint-disable react/prop-types */
import './SearchBar.css'

/**
 * SearchBar - Presents the game search controls.
 */
function SearchBar({ value, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(event)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-bar__label" htmlFor="game-search">
        Search for a game
      </label>
      <div className="search-bar__controls">
        <input
          id="game-search"
          className="search-bar__input"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="Enter a game name"
          maxLength={100}
        />
        <button className="search-bar__button" type="submit">
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
