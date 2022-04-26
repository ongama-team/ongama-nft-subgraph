# Ongama NFT Subgraph

[@schema.graphql](schema.graphql) for up to date schema of entities and fields

## Usage

1. `yarn` to install packages
2. `yarn codegen` to generate codes based on schema & events
3. `yarn build` to build the code base
4. `yarn deploy` to compile and deploy the subgraph 

### Dev abis

To use a version of contract abis that are not published to npm yet use the following steps:

In the ongama-nft-contract repo:
1. Run `yarn compile` to generate the contract abi, which will be located under build/contracts/NFT.json

