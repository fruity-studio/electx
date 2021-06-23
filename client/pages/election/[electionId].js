import React, { useEffect, useState } from 'react'

function Election({ router, loadElection, addElectionCandidate }) {
  const [election, updateElection] = useState({})
  const [candidates, updateCandidates] = useState([])
  const [roles, updateRoles] = useState({})
  const { electionId } = router.query

  const refreshElection = async () => {
    const electionInfo = await loadElection(electionId)
    updateElection(electionInfo.election)
    updateCandidates(electionInfo.candidates)
    updateRoles({
      role: parseInt(electionInfo.role),
      roleRequest: parseInt(electionInfo.roleRequest),
    })
  }

  const addCandidate = async () => {
    // await addElectionCandidate(electionId, "Bliss", "Youth Party")
    // await refreshElection()
  }

  useEffect(async () => {
    await refreshElection()
    await addCandidate()
  }, [])

  console.log({ candidates })

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-6 gap-4">
        {candidates.map((candidate) => (
          <div>
            <div>{candidate.name}</div>
            <div>{candidate.party}</div>
            <div>{candidate.votes}</div>
          </div>
        ))}
        <div className="h-40 border rounded p-2">Add New Candidate</div>
      </div>
    </div>
  )
}

export default Election
