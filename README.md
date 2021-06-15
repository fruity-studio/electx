# Smart contract for a blockchain driven election platform


Use solidity variable  `block.timestamp` to `startRegistration`. More here [https://docs.soliditylang.org/en/v0.4.24/units-and-global-variables.html#time-units](https://docs.soliditylang.org/en/v0.4.24/units-and-global-variables.html#time-units)

## Issues to tackle

- Abuse
- Accountability
- Accessibility
- Ease of use
- Interference
- O
- U

## Access levels

National -> State -> Zone

## Modifiers

```txt
isValidVoter
canVoteFor
isWithinPollDate
isValidCandidate
```

## Process

```txt
- Deploy contract
- Setup state level access (2 way approval process)
- Setup Zone level access (2 way approval process)
- Voter level access (2 way approval process)

NB: User can apply to get level access,
present code for application request
and then have that approved by a higher level admin


- Create a new election
- Add candidates

- Fetch candidates
- Vote for selected candidate in an election

```
