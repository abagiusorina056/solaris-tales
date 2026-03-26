import React from 'react'
import { Progress } from '@src/components/ui/progress'
import StarReviewComponent from './StarReviewComponent'
import { averageReview, buildPercentages, calculateProcess, cn } from '@src/lib/utils'
import { Separator } from '@src/components/ui/separator'

const ReviewsComponent = ({ allStarReviews }) => {
  const averageOfReviews = averageReview(allStarReviews)
  const percentages = buildPercentages(allStarReviews)

  return (
    <>
      <Separator className="my-8" />
      
      <div className='px-16'>
        <h3 className='font-extrabold text-4xl mb-7'>Recenzii:</h3>
        <div className='flex items-center w-3/4 gap-16'>
          <div className='flex flex-col flex-1/5 aspect-square items-center justify-center bg-[#edebeb] rounded-xl font-extrabold'>
            <span
              className={cn('text-4xl text-center', !averageOfReviews && "text-xl")}
            >
              {averageOfReviews || <p>Nu exista recenzii</p>}
            </span>
            {averageOfReviews && <StarReviewComponent review={averageOfReviews} size={24} />}
            <span className="text-2xl font-light">({allStarReviews.length} {allStarReviews.length === 1 ? "recenzie": "recenzii"})</span>
          </div>
          <div className='flex flex-col-reverse gap-2 flex-4/5'>
            {Object.values(percentages).map(
              (value, i) => (
                <div key={i} className='flex items-center flex-nowrap gap-4'>
                  <span className="whitespace-nowrap font-bold text-2xl text-[#7a7a7a]">
                    {i + 1} {5 - i === 1 ? "stele" : "stele"}
                  </span>
                  <Progress value={calculateProcess(allStarReviews.length, value)} color="[var(--color-primary)]" />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ReviewsComponent