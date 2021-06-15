pragma solidity ^0.8.0;

contract Elections {

    struct Candidate {
        bytes32 id;
        string name;
        string party;
        uint256 votes;
    }

	struct Election {
		string name;
		string description;
		uint256 pollStart;
		uint256 pollEnd;
    	bytes32[] candidatesID;
		address[] voted;
		mapping(bytes32 => Candidate) candidatesMap;
    	mapping(address => bytes32) votesMap;
	}

	// variables
	uint elections = 0;
	mapping (uint => Election) electionsMap;
    

    modifier isValidCandidate(uint _electionId, bytes32 _candidateId) {
        require(electionsMap[_electionId].candidatesMap[_candidateId].id != 0, "Candidate does not exist");
        _;
    }

    modifier isWithinPollDate(uint _electionId) {
        uint256 currentTime = block.timestamp;
        require(
            electionsMap[_electionId].pollStart < currentTime,
            "The polls are not yet open for this election"
        );
        require(
            currentTime > electionsMap[_electionId].pollEnd,
            "The polls have closed for this election"
        );
        _;
    }

    function createElection (
		string memory _name,
        string[2][] memory _candidates,
        string memory _description,
        uint256 start,
        uint256 end
    ) public {
		elections += 1;
		// generate unique ID for election
		// use ID to setup candidate
		// use ID to setup voters
        // set poll start and end date
		electionsMap[elections].name = _name;
        electionsMap[elections].description = _description;
        electionsMap[elections].pollStart = start;
        electionsMap[elections].pollEnd = end;
        // loop through all the candidates [ [ name, party ] ]
        for (uint256 i = 0; i < _candidates.length; i++) {
            // get current candidate
            string[2] memory thisCandidate = _candidates[i];
            string memory candidateName = thisCandidate[0];
            string memory candidateParty = thisCandidate[1];
            // create unique ID for given candidate
            bytes32 id = keccak256(bytes(candidateName));
            // map candidate ID to candidate Information
            electionsMap[elections].candidatesMap[id] = Candidate({
                id: id,
                name: candidateName,
                party: candidateParty,
                votes: 0
            });
            // store candidates ID for easy iteration
            electionsMap[elections].candidatesID.push(id);
        }
    }

    // fetch candidates
    function getCandidate(uint _electionId, bytes32 _candidateId)
        public
        view
        isValidCandidate(_electionId, _candidateId)
        returns (string memory name, string memory party, uint256 votes)
    {
        Candidate memory currCandidate = electionsMap[_electionId].candidatesMap[_candidateId];
        name = currCandidate.name;
		party = currCandidate.party;
        votes = currCandidate.votes;
    }

    // addVote
}