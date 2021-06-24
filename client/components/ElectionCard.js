import moment from 'moment'
import React from 'react'

import timeUtils from '../lib/timeUtils'

function ElectionCard({
  _id,
  name,
  description,
  pollStart,
  pollEnd,
  selectElection,
}) {
  const isInFuture = timeUtils.isInFuture(pollStart)
  const isCompleted = timeUtils.isCompleted(pollEnd)
  const opensIn = timeUtils.opensIn(pollStart, pollEnd)

  return (
    <div
      className="w-full rounded shadow p-2 text-sm mb-2 border"
      key={_id}
      onClick={() => selectElection(_id)}
    >
      {/* <div className="flex flex-1 flex-row justify-between"> */}
      <div className="flex flex-1 w-full flex-col pb-1 border-b mb-1 min-w-0">
        <span className="w-full overflow-ellipsis overflow-hidden block text-gray-500 whitespace-nowrap">
          Election #{_id}
        </span>
        <h2 className="mb-1">{name}</h2>
      </div>
      <div className="mb-1">{description}</div>
      <div className="text-gray-500">
        <span className="italic text-sm">
          Poll {isInFuture ? "opens" : isCompleted ? "closed" : "closes"}{" "}
          {opensIn}
        </span>
      </div>
    </div>
  )
}

export default ElectionCard
