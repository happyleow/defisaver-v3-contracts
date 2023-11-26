/* eslint-disable import/no-extraneous-dependencies */
require('hardhat-tracer');
require('dotenv-safe').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
const tdly = require('@tenderly/hardhat-tenderly');
require('@nomiclabs/hardhat-ethers');
// require("hardhat-gas-reporter");
require('hardhat-log-remover');

const Dec = require('decimal.js');
const dfs = require('@defisaver/sdk');

tdly.setup({ automaticVerifications: false });

dfs.configure({
    testingMode: true,
});

Dec.set({
    precision: 50,
    rounding: 4,
    toExpNeg: -7,
    toExpPos: 21,
    maxE: 9e15,
    minE: -9e15,
    modulo: 1,
    crypto: false,
});

const MAX_NODE_COUNT = 22;
const testNetworks = Object.fromEntries([...Array(MAX_NODE_COUNT).keys()].map((c, i) => [
    `local${i}`, { url: `http://127.0.0.1:${8545 + i}`, timeout: 10000000, name: 'mainnet' },
]));
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    saveOnTenderly: false,
    defaultNetwork: 'fork',
    lightTesting: true,
    networks: {
        ...testNetworks,
        local: {
            url: 'http://127.0.0.1:8545',
            timeout: 1000000,
            gasPrice: 170000000000,
            name: 'mainnet',
        },
        localOptimism: {
            url: 'http://127.0.0.1:8545',
            timeout: 1000000,
            gasPrice: 1883022292,
            name: 'optimism',
        },
        localArbitrum: {
            url: 'http://127.0.0.1:8545',
            timeout: 1000000,
            gasPrice: 1700000000,
            name: 'arbitrum',
        },
        localBase: {
            url: 'http://127.0.0.1:8545',
            timeout: 1000000,
            gasPrice: 1700000000,
            name: 'base',
        },
        fork: {
            url: `https://rpc.tenderly.co/fork/${process.env.FORK_ID}`,
            timeout: 1000000,
            type: 'tenderly',
            name: 'mainnet',
        },
        hardhat: {
            forking: {
                url: process.env.ETHEREUM_NODE,
                timeout: 1000000,
                gasPrice: 50000000000,
                // blockNumber: 12068716
            },
            name: 'mainnet',
        },
        // NETWORKS FOR DEPLOYING
        mainnet: {
            url: process.env.ETHEREUM_NODE,
            accounts: [process.env.PRIV_KEY_MAINNET],
            name: 'mainnet',
            txType: 2,
            blockExplorer: 'etherscan',
            contractVerification: true,
        },
        optimism: {
            url: process.env.OPTIMISM_NODE,
            accounts: [process.env.PRIV_KEY_OPTIMISM],
            chainId: 10,
            name: 'optimistic',
            txType: 0,
            blockExplorer: 'etherscan',
            contractVerification: true,
        },
        base: {
            url: process.env.BASE_NODE,
            accounts: [process.env.PRIV_KEY_BASE],
            chainId: 8453,
            name: 'base',
            txType: 0,
            blockExplorer: 'etherscan',
            contractVerification: true,
        },
        arbitrum: {
            url: process.env.ARBITRUM_NODE,
            accounts: [process.env.PRIV_KEY_ARBITRUM],
            chainId: 42161,
            name: 'arbitrum',
            txType: 0,
            blockExplorer: 'arbiscan',
            contractVerification: true,
        },
    },
    solidity: {
        version: '0.8.10',
        settings: {
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    tenderly: {
        username: process.env.TENDERLY_USERNAME,
        project: process.env.TENDERLY_PROJECT,
        forkNetwork: '1',
    },
    mocha: {
        timeout: 100000,
    },
    wethAddress: {
        Mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        Arbitrum: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        Optimism: '0x4200000000000000000000000000000000000006',
        Base: '0x4200000000000000000000000000000000000006',
    },
};

require('./scripts/hardhat-tasks.js');
