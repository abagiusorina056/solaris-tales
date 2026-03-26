const { IconCircleDashed, IconLoader2, IconCircleCheckFilled } = require("@tabler/icons-react");
const { default: Image } = require("next/image");

function BookPreview({ data, isDeleteing }) {
  return (
    <>
      <span>Urmeaza sa stergi urmatoarele carti:</span>

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
          <Image
            src={e.image}
            width={300}
            height={300}
            className="w-6 aspect-[1/1.5] object-cover object-center"
            alt=""
          />
          <span className="text-xl text-black">{e.title}</span>
          <span className="text-lg">•</span>
          <span className="flex items-center gap-1">
            <span className="bg-gray-200 text-gray-500 rounded-sm px-2 py-1">
              id
            </span>
            <span>{e.id}</span>
          </span>
        </span>
      ))}
    </>
  )
}

export default BookPreview