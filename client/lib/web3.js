import Web3 from "web3"

// import VhotaArtifact from './contracts/Vhota.json'
import VhotaArtifact from "../../build/contracts/Vhota.json"

class web3Helpers {
  web3 = null
  contract = null
  account = null

  init = async () => {
    const { ethereum } = window

    if (ethereum) {
      // use MetaMask's provider
      this.web3 = new Web3(ethereum)
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      this.account = accounts[0]

      const networkId = await this.web3.eth.net.getId()
      const deployedNetwork = VhotaArtifact.networks[networkId]
      this.contract = new this.web3.eth.Contract(
        VhotaArtifact.abi,
        deployedNetwork.address
      )

      return true
    } else {
      console.warn("No web3 detected.")
      // console.warn('No web3 detected. Falling back to Ganache: http://127.0.0.1:7545')
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      // config.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
    }
  }

  getAccountAddress = async () => {
    const accounts = await this.web3.eth.getAccounts()
    return accounts[0]
  }

  getReturnValue = async (v) => {
    const [eventName] = Object.keys(v.events)
    return eventName ? v.events[eventName].returnValues : {}
  }

  contractActionsFactory = async (name, params = [], send = true) => {
    const { methods } = this.contract
    const [from] = await this.web3.eth.getAccounts()
    const handler = params ? methods[name](...params) : methods[name]()

    return await handler[send ? "send" : "call"]({ from })
  }

  callContractWithParams = async (name, params = []) =>
    this.contractActionsFactory(name, params, false)
  sendContractWithParams = async (name, params = []) =>
    this.contractActionsFactory(name, params, true)

  createNewElection = async ({ name, description, pollStart, pollEnd }) =>
    await this.sendContractWithParams("createElection", [
      name,
      description,
      pollStart,
      pollEnd,
      3,
    ])

  addElectionCandidate = async (electionId, { name, manifesto, party }) => {
    return await this.sendContractWithParams("addCandidateToElection", [
      electionId,
      name,
      manifesto,
      party,
    ])
  }

  manageElectionRole = async (electionId, role, cancel) => {
    const roles = {
      state: "requestStateValidatorRole",
      zone: "requestZoneValidatorRole",
      voter: "requestVoterRole",
    }
    const requestRole = roles[role]
    if (requestRole) {
      return await this.sendContractWithParams(requestRole, [electionId])
    }

    if (cancel) {
      return await this.sendContractWithParams("revokeRoleRequest", [
        electionId,
      ])
    }
  }

  approveRoleRequest = async (electionId, requestId) => {
    return await this.sendContractWithParams("approveRoleRequest", [
      electionId,
      requestId,
    ])
  }

  getCandidates = async (electionId) => {
    // load candidates
    const candidatesList = await this.callContractWithParams(
      "getCandidatesForElection",
      [electionId]
    )
    // loop through candidates list and load all candidates info
    return await Promise.all(
      candidatesList.map(async (candidateId) =>
        this.callContractWithParams("getCandidateById", [
          electionId,
          candidateId,
        ])
      )
    )
  }

  getElectionById = async (electionId) => {
    const election = await this.callContractWithParams("getElectionById", [
      electionId,
    ])

    return election
  }

  loadElection = async (electionId) => {
    // load election information
    const election = await this.callContractWithParams("getElectionById", [
      electionId,
    ])
    // load candidates for election
    const candidates = await this.getCandidates(electionId)
    // load status for election
    const role = await this.callContractWithParams("getRoleForElection", [
      electionId,
    ])
    // active role request
    const roleRequest = await this.callContractWithParams("getRoleRequest", [
      electionId,
    ])

    const voteStatus = await this.callContractWithParams(
      "userHasVotedForElection",
      [electionId]
    )

    return { election, candidates, role, roleRequest, voteStatus }
  }

  voteElectionCandidate = async (electionId, candidate) => {
    return await this.sendContractWithParams("voteElectionCandidate", [
      electionId,
      candidate,
    ])
  }
}

export default new web3Helpers()
