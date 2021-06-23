// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Candidates {
    struct Candidate {
        bytes32 id;
        string name;
        string party;
        string manifesto;
        uint256 votes;
        bool disqualified;
    }

    mapping(bytes32 => mapping(bytes32 => Candidate))
        private _electionCandidates;
    mapping(bytes32 => bytes32[]) private candidatesID;

    //events
    event CandidateAdded(
        bytes32 indexed id,
        string indexed name,
        string indexed party,
        string manifesto,
        address admin
    );

    // modifiers for validation
    modifier isValidCandidate(bytes32 electionId, bytes32 candidateId) {
        require(
            _electionCandidates[electionId][candidateId].id == candidateId,
            "Invalid Candidate"
        );
        _;
    }

    function _addCandidate(
        bytes32 electionId,
        string memory name,
        string memory manifesto,
        string memory party
    ) internal {
        bytes32 id = keccak256(abi.encodePacked(name, party));
        Candidate memory newCandidate =
            Candidate({
                id: id,
                name: name,
                party: party,
                manifesto: manifesto,
                votes: 0,
                disqualified: false
            });
        _electionCandidates[electionId][id] = newCandidate;
        candidatesID[electionId].push(id);

        emit CandidateAdded(id, name, party, manifesto, msg.sender);
    }

    function getCandidatesForElection(bytes32 electionId)
        public
        view
        returns (bytes32[] memory)
    {
        return candidatesID[electionId];
    }

    function getCandidateById(bytes32 electionId, bytes32 candidateId)
        public
        view
        isValidCandidate(electionId, candidateId)
        returns (
            bytes32 id,
            string memory name,
            string memory party,
            string memory manifesto,
            uint256 votes,
            bool disqualified
        )
    {
        id = _electionCandidates[electionId][candidateId].id;
        name = _electionCandidates[electionId][candidateId].name;
        party = _electionCandidates[electionId][candidateId].party;
        manifesto = _electionCandidates[electionId][candidateId].manifesto;
        votes = _electionCandidates[electionId][candidateId].votes;
        disqualified = _electionCandidates[electionId][candidateId]
            .disqualified;
    }

    function _voteCandidate(bytes32 electionId, bytes32 candidateId) internal {
        _electionCandidates[electionId][candidateId].votes += 1;
    }

    function _getCandidateVote(bytes32 electionId, bytes32 candidateId)
        internal
        view
        returns (uint256 votes)
    {
        votes = _electionCandidates[electionId][candidateId].votes;
    }

    function _disqualifyCandidate(bytes32 electionId, bytes32 candidateId)
        internal
    {
        _electionCandidates[electionId][candidateId].disqualified = true;
    }
}
