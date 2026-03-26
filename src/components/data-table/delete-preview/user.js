const { IconCircleDashed, IconLoader2, IconCircleCheckFilled } = require("@tabler/icons-react");

function UserPreview({ data, isDeleteing, userType }) {
  return (
    <>
      <span>Urmeaza sa stergi urmatorii {userType === "author" ? "autori" : "utilizatori"}:</span>

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
          
          <span className="text-xl text-black">{e.name}</span>
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

export default UserPreview