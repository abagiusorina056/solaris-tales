const { IconCircleDashed, IconStarFilled, IconLoader2, IconCircleCheckFilled } = require("@tabler/icons-react");
const { default: Image } = require("next/image");

function ReviewPreview({ data, isDeleteing }) {
  return (
    <>
      <span>Urmeaza sa stergi urmatoarele recenzii:</span>

      {data.map((e, i) => (
        <span key={i} className="flex items-center gap-3 mt-2">
          {isDeleteing === false && 
            <IconCircleDashed width="16" height="16" />
          }
          {isDeleteing === true && 
            <IconLoader2 
              width="16" 
              height="16" 
              className="rotate"
            />
          }
          {isDeleteing === "done" && 
            <IconCircleCheckFilled width="16" height="16" color="#00c591" />
          }
          <span className="flex gap-1 items-center">
            <span className="max-w-md truncate">
              {e.review}
            </span>
            <IconStarFilled color="#fdc700" size={16} />
          </span>
          <span className="text-lg">•</span>
          <span className="flex items-center gap-2">
            <Image
              src={e.reviewerImage}
              width={24}
              height={24}
              className="rounded-full"
              alt=""
            />
            <span>{e.reviewerName}</span>
          </span>
          <span className="text-lg">•</span>
          <span className="flex items-center gap-2">
            <Image
              src={e.bookImage}
              width={300}
              height={300}
              className="w-4 aspect-[1/1.5] object-cover object-center"
              alt=""
            />
            <span>{e.bookTitle}</span>
          </span>
        </span>
      ))}
    </>
  )
}

export default ReviewPreview