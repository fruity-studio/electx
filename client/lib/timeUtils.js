import moment from 'moment'

// const now = () => Date.now() / 1000
const now = () => Date.now()
const isInFuture = (time) => parseInt(time) > now()
const isInProgress = (start = 0, end = 0) =>
  parseInt(start) <= now() <= parseInt(end)
const isCompleted = (time) => now() > parseInt(time)
const opensIn = (start, end) =>
  isInFuture(start)
    ? moment().to(moment(parseInt(start)))
    : isCompleted(end)
    ? moment(parseInt(end)).fromNow()
    : moment().to(moment(parseInt(end)))

export default {
  now,
  isInFuture,
  isInProgress,
  isCompleted,
  opensIn,
}
