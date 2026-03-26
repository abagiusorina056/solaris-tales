import React, { useState } from "react"
import { cn } from "@src/lib/utils"
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa"

const StarReviewComponent = ({ review, handleStarReview, active = false, size }) => {
  const stars = [1, 2, 3, 4, 5]

  const [savedStars, setSavedStars] = useState(review || 0)
  const [displayingStars, setDisplayingStars] = useState(review || 0)

  const handleEnter = (num) => {
    if (!active) return
    setDisplayingStars(num)
  }

  const handleLeave = () => {
    if (!active) return
    setDisplayingStars(savedStars)
  }

  const handleClick = (num) => {
    if (!active) return
    setSavedStars(num)
    setDisplayingStars(num)
    handleStarReview(num)
  }

  return (
    <div
      onMouseLeave={handleLeave}
      className="flex items-center mt-2 mb-5 gap-1 text-yellow-400"
    >
      {stars.map((num, i) => {
        const isHalf =
          savedStars % 1 !== 0 &&
          Math.ceil(savedStars) === num &&
          displayingStars === savedStars

        const isFull = num <= displayingStars

        return (
          <span
            key={i}
            className={cn("cursor-pointer", !active && "pointer-events-none")}
            onMouseEnter={() => handleEnter(num)}
            onClick={() => handleClick(num)}
          >
            {isFull ? (
              <FaStar size={size} />
            ) : isHalf ? (
              <FaStarHalfAlt size={size} />
            ) : (
              <FaRegStar size={size} />
            )}
          </span>
        )
      })}
    </div>
  )
}

export default StarReviewComponent
