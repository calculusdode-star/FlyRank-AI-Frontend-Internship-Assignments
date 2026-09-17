/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import './GameCard.css'

/**
 * GameCard - Presents a single game.
 */
function GameCard({ game }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="game-card-link"
      aria-label={`View details for ${game.name}`}
    >
      <article className="game-card">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={`${game.name} cover art`}
            className="game-card__image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="game-card__image-placeholder">No image available</span>
        )}
        <h3 className="game-card__title">{game.name}</h3>
      </article>
    </Link>
  )
}

export default GameCard
