##  Overview

A repository of VC smart contracts.

## Getting started

You could clone the repository and try the smart contracts in your local machine, you need also to install [truffle](https://trufflesuite.com/truffle/) to interact with the code.

From your comand line:
```bash
# Clone this repository 
$ git clone gh repo clone https://github.com/Datagen-Project/VCSmart_Contracts.git

# Go into the repository
$ cd VCSmart_Contracts

# Install dependencies
$ npm install

# Install truffle 
$ npm install truffle -g
```

Download [ganache](https://trufflesuite.com/ganache/) to run a local blockchain on your machine, there is also a [cli verison of ganache](https://github.com/trufflesuite/ganache-cli-archive).

## Testing 

Run ganache and and start a local blockchain clicking on "Quickstart".

Now you could test the contracts, we suggest to test the contracts one by one.

From your comand line:

```bash
# e.g. if you want to test DataGen contract
$ truffle test VCTemplate.test.js
```
***Note***: 

- If there is a time manipulation of the blockchian in the test you need to restart the blockchain to get it pass every time you run a test, for this reason some tests need to be done one by one.

## Licensing

The code in this project is licensed under [GNU general Public License v3.0](https://github.com/Datagen-Project/DataGen-Smart-Contracts/blob/main/LICENSE.md).
