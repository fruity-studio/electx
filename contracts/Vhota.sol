// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./subcontracts/Candidates.sol";
import "./subcontracts/Roles.sol";

contract Vhota is Roles, Candidates {
    struct Vote {
        address user;
        bytes32 candidate;
        bool voted;
    }

    struct Election {
        bytes32 id;
        uint256 index;
        string name;
        string description;
        uint256 pollStart;
        uint256 pollEnd;
        address creator;
        mapping(address => Vote) voted;
    }

    struct ElectionMeta {
        address creator;
        bytes32 id;
    }

    // variables
    uint256 elections = 0;
    mapping(bytes32 => Election) electionsMap;
    ElectionMeta[] electionsList;
    mapping(address => bytes32[]) electionsByUsers;
    // mapping(address => bytes32[]) associatedElections;

    event ElectionCreated(bytes32 id, address sender);

    modifier isValidElection(bytes32 electionId) {
        require(
            electionsMap[electionId].id == electionId,
            "Invalid election selection"
        );
        _;
    }

    modifier isBeforeElectionStart(bytes32 _electionId) {
        require(
            (electionsMap[_electionId].pollStart / 1000) > block.timestamp,
            "You can't add a candidate to an ongoing election"
        );
        _;
    }

    modifier isWithinPollDate(bytes32 _electionId) {
        uint256 currentTime = block.timestamp;
        require(
            (electionsMap[_electionId].pollStart / 1000) <= currentTime,
            "The polls are not yet open for this election"
        );
        require(
            currentTime <= (electionsMap[_electionId].pollEnd / 1000),
            "The polls have closed for this election"
        );
        _;
    }

    modifier hasNotVoted(bytes32 _electionId) {
        require(
            electionsMap[_electionId].voted[msg.sender].voted == false,
            "You have already voted in this election"
        );
        _;
    }

    function createElection(
        string memory _name,
        string memory _description,
        uint256 start,
        uint256 end,
        uint256 _adminLimit
    ) public returns (bytes32 id) {
        elections += 1;
        id = keccak256(
            abi.encodePacked(_name, _description, msg.sender, elections)
        );
        electionsMap[id].id = id;
        electionsMap[id].index = elections;
        electionsMap[id].name = _name;
        electionsMap[id].description = _description;
        electionsMap[id].pollStart = start;
        electionsMap[id].pollEnd = end;
        electionsMap[id].creator = msg.sender;
        electionsList.push(ElectionMeta({creator: msg.sender, id: id}));
        electionsByUsers[msg.sender].push(id);
        // add admin roles as needed
        _setupRolesForElection(id, _adminLimit);

        emit ElectionCreated(id, msg.sender);
    }

    function addElectionAdmin(bytes32 electionId, address _newAdmin)
        public
        isValidElection(electionId)
    {
        _addElectionAdmin(electionId, _newAdmin);
    }

    function getElectionById(bytes32 id)
        public
        view
        returns (
            bytes32 _id,
            string memory name,
            string memory description,
            uint256 pollStart,
            uint256 pollEnd,
            address creator
        )
    {
        _id = id;
        name = electionsMap[id].name;
        description = electionsMap[id].description;
        pollStart = electionsMap[id].pollStart;
        pollEnd = electionsMap[id].pollEnd;
        creator = electionsMap[id].creator;
    }

    function addCandidateToElection(
        bytes32 electionId,
        string memory name,
        string memory manifesto,
        string memory party
    )
        public
        isValidElection(electionId)
        isBeforeElectionStart(electionId)
        isElectionAdmin(electionId)
    {
        _addCandidate(electionId, name, manifesto, party);
    }

    function userHasVotedForElection(bytes32 electionId)
        public
        view
        isValidElection(electionId)
        returns (bool voted, bytes32 candidate)
    {
        voted = electionsMap[electionId].voted[msg.sender].voted;
        candidate = electionsMap[electionId].voted[msg.sender].candidate;
    }

    function voteElectionCandidate(bytes32 _electionId, bytes32 _candidateId)
        public
        hasNotVoted(_electionId)
        isWithinPollDate(_electionId)
    {
        electionsMap[_electionId].voted[msg.sender] = Vote({
            user: msg.sender,
            candidate: _candidateId,
            voted: true
        });
        _voteCandidate(_electionId, _candidateId);
    }
}
