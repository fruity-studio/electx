// import Head from 'next/head'
import { useEffect, useState } from "react"
import { Scrollbars } from "react-custom-scrollbars"

import {
  CreateCandidateModal,
  CreateElectionModal,
  Election,
  ElectionCard,
} from "../components"
import storage from "../lib/localstorage"

// import { User } from 'react-feather'
export default function Home({
  account,
  getElectionById,
  loadElection,
  createNewElection,
  addElectionCandidate,
  manageElectionRole,
  approveRoleRequest,
  voteElectionCandidate,
  getReturnValue,
}) {
  const [electionInput, updateElectionInput] = useState("")
  const [elections, updateElections] = useState({})
  const [selectedElection, updateSelectedElection] = useState(null)
  const [lastAddedCandidate, updateLastAddedCandidate] = useState(null)

  // modal visibility states
  const [showElectionModal, updateElectionModal] = useState(false)
  const [showNewCandidateModal, updateShowNewCandidateModal] = useState(false)

  const fetchElectionById = async (id) => {
    const election = await getElectionById(id)
    return election
  }

  const loadElectionById = async (id) => {
    const election = await getElectionById(id)
    storage.add(id)
    updateElections({ [id]: election, ...elections })
  }

  const handleElectionSearch = async (e) => {
    e.preventDefault()
    await loadElectionById(electionInput)
    updateElectionInput("")
  }

  const createElection = async (params) => {
    const elResponse = await createNewElection(params)
    const { id } = await getReturnValue(elResponse)
    await loadElectionById(id)
    updateSelectedElection(id)
  }

  const addNewCandidate = async ({ name, party, manifesto }) => {
    const elRes = await addElectionCandidate(selectedElection, {
      name,
      party,
      manifesto,
    })
    const { id } = await getReturnValue(elRes)
    updateLastAddedCandidate(id)
  }

  useEffect(async () => {
    // get saved elections from localstorage
    if (account.length > 0) {
      const savedElections = storage.getAll()
      const allSavedElectionsData = (
        await Promise.all(
          savedElections.map(async (id) => await fetchElectionById(id))
        )
      )
        .reverse()
        .reduce((acc, i) => {
          acc[i._id] = i
          return acc
        }, {})
      updateElections(allSavedElectionsData)
      savedElections.length > 0 &&
        updateSelectedElection(savedElections[savedElections.length - 1])
    }
  }, [account])

  return (
    <>
      <div className="container self-center">
        <div className="flex flex-row w-full h-full py-2 text-base">
          <div className="w-1/4 h-full border-r p-2 flex flex-col justify-between">
            <div className="w-full">
              <div className="w-full mb-2">
                <form onSubmit={handleElectionSearch} className="flex flex-1">
                  <input
                    className="flex flex-1 mr-1 rounded p-2 bg-gray-200"
                    type="text"
                    value={electionInput}
                    onChange={(e) => updateElectionInput(e.target.value)}
                    placeholder="Poll ID..."
                  />
                  <input
                    className="rounded p-2 px-3 bg-transparent border-2 border-gray-300 hover:border-gray-500"
                    type="Submit"
                    defaultValue="Add"
                  />
                </form>
              </div>
            </div>

            {/* Election item */}
            <div className="w-full flex flex-1">
              <Scrollbars
                style={{ overflowX: "visible" }}
                autoHeight
                autoHeightMin="100%"
                autoHeightMax={`calc(100vh - 125px)`}
              >
                {Object.values(elections).map((electionItem) => (
                  <ElectionCard
                    {...electionItem}
                    key={electionItem._id}
                    selectElection={updateSelectedElection}
                  />
                ))}
              </Scrollbars>
            </div>
            <div className="w-full">
              <button
                className="text-sm w-full py-3 rounded flex items-center justify-center border-2 border-gray-300 hover:border-gray-500"
                onClick={() => updateElectionModal(true)}
              >
                Create New Poll
              </button>
            </div>
          </div>
          <div className="flex flex-1 h-full p-2">
            <Election
              electionId={selectedElection}
              lastAddedCandidate={lastAddedCandidate}
              loadElection={loadElection}
              manageElectionRole={manageElectionRole}
              approveRoleRequest={approveRoleRequest}
              voteElectionCandidate={voteElectionCandidate}
              addCandidate={() => updateShowNewCandidateModal(true)}
            />
          </div>
        </div>
      </div>
      <CreateElectionModal
        showModal={showElectionModal}
        closeModal={() => updateElectionModal(false)}
        createElection={createElection}
      />
      <CreateCandidateModal
        showModal={showNewCandidateModal}
        closeModal={() => updateShowNewCandidateModal(false)}
        addNewCandidate={addNewCandidate}
      />
    </>
  )
}
