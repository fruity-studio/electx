// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Roles {
    enum RoleStates {nonuser, voter, zone, state, federal}

    struct User {
        address user;
        bool canVote;
        address validator;
        RoleStates role;
    }

    struct RolesData {
        uint256 adminsCount;
        uint256 stateValidatorsCount;
        uint256 zoneValidatorsCount;
        uint256 votersCount;
        uint256 adminLimit;
        mapping(address => User) members;
    }

    struct RequestData {
        bytes32 id;
        address user;
        RoleStates requestType;
    }

    // electionId -> uniqueRequestId -> User Address
    mapping(bytes32 => mapping(bytes32 => RequestData)) private _roleRequests;
    // electionId
    mapping(bytes32 => RolesData) private _electionRoles;

    // events
    event AdminAdded(
        bytes32 indexed election,
        address indexed newAdmin,
        address indexed sender
    );

    // modifiers
    modifier isElectionAdmin(bytes32 electionId) {
        require(
            _electionRoles[electionId].members[msg.sender].role ==
                RoleStates.federal,
            "You're not admin for this election"
        );
        _;
    }

    modifier isCorrectValidator(bytes32 electionId, RoleStates role) {
        require(_electionRoles[electionId].members[msg.sender].role == role);
        _;
    }

    modifier isValidVoter(bytes32 electionId) {
        require(
            _electionRoles[electionId].members[msg.sender].canVote,
            "You're not a verified voter for this election"
        );
        _;
    }

    modifier isValidRoleRequest(bytes32 electionId, bytes32 requestId) {
        require(
            _roleRequests[electionId][requestId].user != address(0),
            "Invalid role request"
        );
        _;
    }

    modifier canValidateRoleRequest(bytes32 electionId, bytes32 requestId) {
        uint256 requestState =
            uint256(_roleRequests[electionId][requestId].requestType);
        uint256 requiredApproverRole = requestState + 1;
        require(
            uint256(_electionRoles[electionId].members[msg.sender].role) ==
                requiredApproverRole,
            "You don't have the required role to approve this request."
        );
        _;
    }

    // functions
    function _setupRolesForElection(bytes32 electionId, uint256 _adminLimit)
        internal
    {
        _electionRoles[electionId].members[msg.sender] = User({
            user: msg.sender,
            canVote: true,
            validator: address(0),
            role: RoleStates.federal
        });
        _electionRoles[electionId].adminLimit = _adminLimit;
        _electionRoles[electionId].adminsCount += 1;
    }

    function getRoleForElection(bytes32 electionId)
        public
        view
        returns (uint256 role)
    {
        role = uint256(_electionRoles[electionId].members[msg.sender].role);
    }

    function _addElectionAdmin(bytes32 electionId, address _newAdmin)
        internal
        isElectionAdmin(electionId)
    {
        _electionRoles[electionId].members[_newAdmin] = User({
            user: _newAdmin,
            canVote: true,
            validator: msg.sender,
            role: RoleStates.federal
        });
        emit AdminAdded(electionId, _newAdmin, msg.sender);
    }

    function requestStateValidatorRole(bytes32 electionId)
        public
        returns (bytes32 id)
    {
        id = _getRequestIdForRole(electionId);
        _requestRole(electionId, id, RoleStates.state);
    }

    function requestZoneValidatorRole(bytes32 electionId)
        public
        returns (bytes32 id)
    {
        id = _getRequestIdForRole(electionId);
        _requestRole(electionId, id, RoleStates.zone);
    }

    function requestVoterRole(bytes32 electionId) public returns (bytes32 id) {
        id = _getRequestIdForRole(electionId);
        _requestRole(electionId, id, RoleStates.voter);
    }

    function getRoleRequest(bytes32 electionId)
        public
        view
        returns (bytes32 id, uint256 role)
    {
        id = _getRequestIdForRole(electionId);
        role = uint256(_roleRequests[electionId][id].requestType);
    }

    function revokeRoleRequest(bytes32 electionId) public {
        bytes32 id = _getRequestIdForRole(electionId);
        delete _roleRequests[electionId][id];
    }

    function _requestRole(
        bytes32 electionId,
        bytes32 id,
        RoleStates requestType
    ) private {
        _roleRequests[electionId][id] = RequestData({
            id: id,
            user: msg.sender,
            requestType: requestType
        });
    }

    function approveRoleRequest(bytes32 electionId, bytes32 requestId)
        public
        canValidateRoleRequest(electionId, requestId)
    {
        RequestData memory userRequest = _roleRequests[electionId][requestId];
        _electionRoles[electionId].members[userRequest.user] = User({
            user: userRequest.user,
            canVote: true,
            validator: msg.sender,
            role: userRequest.requestType
        });
        delete _roleRequests[electionId][requestId];
    }

    function _getRequestIdForRole(bytes32 electionId)
        internal
        view
        returns (bytes32 id)
    {
        id = keccak256(abi.encodePacked(electionId, msg.sender));
    }
}
