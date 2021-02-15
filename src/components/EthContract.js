import { ethers } from "ethers";
import ABI from './ABI'
import Misc from './misc'

const Client = require('node-rest-client').Client;
const Web3 = require('web3')

const CONTRACT_ADDR = '0x167cB3F2446F829eb327344b66E271D1a7eFeC9A'


class EthContract {
    constructor () {
        const self = this;

        self.ethPrice = null
        self.httpClient = new Client();
        self.contractAddress = CONTRACT_ADDR
        self.walletBalance = null;
        self.buyPrice = null;
        self.sellPrice = null;
        self.sellPrice = null;
        self.web3 = null;

        self.provider = new ethers.providers.Web3Provider(
            window.ethereum
        )

        // console.log('ACCOUNTS', self.accounts)
        console.log('WEB3', Web3.eth)
        console.log('CONTRACT', self.contractAddress)

        self.walletMode = 'metamask'
        self.contract = new ethers.Contract(
            self.contractAddress, ABI, self.provider
        );

        self.interface = self.contract.interface
        // console.log('INTERFACE BP', self.contract.buyPrice())
    }

    getEthBalance = () => this._getEthBalance()
    _getEthBalance () {
        const self = this;
        console.log('BAL', self.walletBalance, self.ethPrice, self.buyPrice)
        if (self.walletBalance === null) {
          return null
        } else if (self.ethPrice === null) {
          return null
        } else if (self.sellPrice === null) {
          return null
        }
        
        const ethValue = self.sellPrice * self.walletBalance
        return ethValue
    }

    loadIfNeeded = async () => await this._loadIfNeeded()
    async _loadIfNeeded () {
        const self = this

        if (self.ethPrice === null) {
            await self.updateEthPrice()
            // console.log('ETH UPDATE', self.ethPrice)
        } if (self.buyPrice === null) {
            await self.loadBuyPrice()
            // console.log('BUY UPDATE', self.buyPrice)
        } if (self.sellPrice === null) {
            await self.loadSellPrice()
            // console.log('BUY UPDATE', self.buyPrice)
        } if (self.walletBalance === null) {
            await self.loadWalletBalance()
            // console.log('WAL UPDATE', self.walletBalance)
        }
    }

    loadBuyPrice = async () => await this._loadBuyPrice()
    async _loadBuyPrice () {
        const self = this
        self.buyPrice = await self._getBuyPrice()
    }

    getBuyPrice = async () => await this._getBuyPrice()
    async _getBuyPrice () {
        const self = this
        const weiBuyPrice = await self.contract.buyPrice()
        const buyPrice = self.convertWeiToEth(weiBuyPrice)
        return buyPrice
    }

    loadSellPrice = async () => await this._loadSellPrice()
    async _loadSellPrice () {
        const self = this
        self.sellPrice = await self._getSellPrice()
    }

    getSellPrice = async () => await this._getSellPrice()
    async _getSellPrice () {
        const self = this
        const weiSellPrice = await self.contract.sellPrice()
        const sellPrice = self.convertWeiToEth(weiSellPrice)
        return sellPrice
    }

    needsLoading () {
        return Boolean(window.ethereum)
    }

    getCurrentAddress () {
        return window.ethereum.selectedAddress
    }

    loadWallet = async () => await this._loadWallet()
    async _loadWallet () {
        const self = this
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
        // get contract balance
        const self = this
        const weiBalance = await self.getWeiBalance()
        const ethBalance = self.convertWeiToEth(weiBalance)
        return ethBalance
    }

    loadWalletBalance = async () => await this._loadWalletBalance()
    async _loadWalletBalance () {
        const self = this
        self.walletBalance = await self._getWalletBalance()
        return self.walletBalance
    }

    getWalletBalance = async () => await this._getWalletBalance()
    async _getWalletBalance () {
        const self = this
        const address = self.getCurrentAddress()
        console.log('ADDRESS', address)
        if (address === null) {
            return null
        }

        const weiBalance = await Promise.race([
            self.contract.balanceOf(address),
            Misc.sleepAsync(2000)
        ])

        const balance = self.convertWeiToEth(weiBalance)
        // console.log('BALANCE', balance)
        return balance
    }

    updateEthPrice = async () => await this._updateEthPrice()
    async _updateEthPrice () {
        const self = this
        const price = await self.fetchEthPrice()
        self.ethPrice = price
        return price
    }

    fetchEthPrice = () => this._fetchEthPrice()
    _fetchEthPrice () {
        const self = this
        const currency = 'USD'
        const baseurl = 'https://api.coingecko.com/api/v3/simple/price'
        const url = `${baseurl}?ids=ethereum&vs_currencies=${currency}`
        const args = {
            headers: { "Content-Type": "application/json" }
        };
        
        return new Promise((resolve) => {
            self.httpClient.get(url, args, (data) => {
                // console.log('DATA', data)
                
                let eth = 0;
                for (var key in data.ethereum) {
                    eth = data.ethereum[key]
                }
                
                const price = parseFloat(eth + currency.toLowerCase())
                resolve(price)
            })
        }).catch((alert) => {
            console.error('ERROR', alert)
        })
    }
}

export default EthContract