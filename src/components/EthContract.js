import { ethers } from "ethers";
import ABI from './ABI'
const Web3 = require('web3')

const CONTRACT_ADDR = '0x167cB3F2446F829eb327344b66E271D1a7eFeC9A'


class EthContract {
    constructor () {
        const self = this;

        self.contractAddress = CONTRACT_ADDR
        self.web3 = null;

        self.provider = new ethers.providers.Web3Provider(
            window.ethereum
        )

        // console.log('ACCOUNTS', self.accounts)
        console.log('WEB3', Web3.eth)
        console.log('CONTRACT', self.contractAddress)
        self.contract = new ethers.Contract(
            self.contractAddress, ABI, self.provider
        );
        
        self.walletMode = 'metamask'
    }

    needsLoading () {
        return Boolean(window.ethereum)
    }

    getCurrentAddress () {
        return window.ethereum.selectedAddress
    }

    loadWallet = async () => await this._loadWallet()
    async _loadWallet () {
        const web3 = new Web3(window.web3.currentProvider);

         // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            self.web3 = window.web3

            try {
                // Request account access if needed
                console.log('CONNECT MORDERN')
                await window.ethereum.enable();
                return window.web3
            } catch (error) {
                // User denied account access...
                return false
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            console.log('CONNECT OLD')
            window.web3 = new Web3(web3.currentProvider);
            self.web3 = window.web3
            return window.web3
        }
        // Non-dapp browsers...
        else {
            console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
            return false
        }
    }

    getWeiBalance = async () => await this._getWeiBalance()
    async _getWeiBalance () {
        const self = this
        return await self.provider.getBalance(
            self.contractAddress
        );
    }

    convertWeiToEth (e) { return e / 1e18 }

    getBalance = async () => await this._getBalance()
    async _getBalance () {
        const self = this
        const weiBalance = await self.getWeiBalance()
        const ethBalance = self.convertWeiToEth(weiBalance)
        return ethBalance
    }
}

export default EthContract