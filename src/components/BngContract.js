import { ethers } from "ethers";
import ABI from './ABI'
import Misc from './misc'

const Client = require('node-rest-client').Client;
const Web3 = require('web3')

const CONTRACT_ADDR = '0x66cB2D528A3380Bd919245D8812b45B03D421Ce5'


function AbiMismatchError(message = "") {
    this.name = "AbiMismatchError";
    this.message = message;
}
AbiMismatchError.prototype = Error.prototype;


class BngContract {
    constructor () {
        const self = this;

        self.httpClient = new Client();
        self.contractAddress = CONTRACT_ADDR

        self.tokenBalance = null;
        self.walletBalance = null;
        self.referralDividends = null;
        self.normalDividends = null;
        
        self.networkChanged = false;
        self.network = null;
        self.chainID = null;

        self.balance = null;
        self.tokens = null;
        self.bngPrice = null;
        self.buyPrice = null;
        self.sellPrice = null;
        self.sellPrice = null;
        self.web3 = null;

        const ethereum = window.ethereum
        self.provider = new ethers.providers.Web3Provider(
            ethereum, 'any'
        );
        self.provider.on('network', (newNetwork, oldNetwork) => {
            console.log('UPDATE PROVIEER', newNetwork)
            // https://docs.ethers.io/v5/single-page/
            // best practice for when the metamask network changes
            // is to simply refresh the page
            if (oldNetwork !== null) {
                self.networkChanged = true
                console.log('REFRESH NETWORK')
                window.location.reload();
            }
        })

        self.account = null
        self.signer = null

        // console.log('ACCOUNTS', self.accounts)
        // console.log('WEB3', Web3.eth)
        // console.log('CONTRACT', self.contractAddress)

        self.walletMode = 'metamask'
        self.contract = new ethers.Contract(
            self.contractAddress, ABI, self.provider
        );

        self.interface = self.contract.interface
        // console.log('INTERFACE BP', self.contract.buyPrice())
    }

    loadNetwork = async () => await this._loadNetwork()
    async _loadNetwork () {
        const self = this
        const network = await self.provider.getNetwork()
        // console.log('NETWORK', network)
        self.network = network
        self.chainID = network.chainId
        return network
    }

    getBngBalance = () => this._getBngBalance()
    _getBngBalance () {
        const self = this;
        
        if (self.tokenBalance === null) {
          return null
        } else if (self.sellPrice === null) {
          return null
        }
        
        const ethValue = self.sellPrice * self.tokenBalance
        return ethValue
    }

    getUsdBalance = () => this._getUsdBalance()
    _getUsdBalance () {
        const self = this
        if (self.bngPrice === null) {
            return null
        }
        const bngBalance = self.getBngBalance()
        if (bngBalance === null) {
            return null
        }

        const usdBalance = bngBalance * self.bngPrice
        return usdBalance
    }

    update = async () => await this._update()
    async _update () {
        const self = this
        try {
            await self.loadNetwork()
            await self.updateBngPrice()
            await self.loadBuyPrice()
            await self.loadSellPrice()
            await self.loadTokenBalance()
            await self.loadWalletBalance()
            await self.loadDividends()
            await self.updateContractStats()
        }  catch (e) {
            console.error(e)
            await Misc.sleepAsync(2000)
        }
    }

    loadIfNeeded = async () => await this._loadIfNeeded()
    async _loadIfNeeded () {
        const self = this

        if (self.bngPrice === null) {
            await self.updateBngPrice()
        } if (self.buyPrice === null) {
            await self.loadBuyPrice()
            // console.log('BUY UPDATE', self.buyPrice)
        } if (self.sellPrice === null) {
            await self.loadSellPrice()
            // console.log('BUY UPDATE', self.buyPrice)
        } if (self.tokenBalance === null) {
            await self.loadTokenBalance()
            // console.log('WAL UPDATE', self.walletBalance)
        } if (self.referralDividends === null) {
            await self.loadDividends()
        }
    }

    loadWalletBalance = async () => await this._loadWalletBalance()
    async _loadWalletBalance () {
        const self = this
        self.walletBalance = await self._getWalletBalance()
        return self.walletBalance
    }

    getWalletBalance = async () => await this._getWalletBalance()
    async _getWalletBalance () {
        // https://ethereum.stackexchange.com/questions/45082/using-ether-js-with-metamask/45165
        const self = this
        const address = self.getCurrentAddress()
        if (address === null) {
            return null
        }

        const weiBalance = await self.provider.getBalance(address)
        const balance = self.convertWeiToEth(weiBalance)
        return balance
    }

    loadBuyPrice = async () => await this._loadBuyPrice()
    async _loadBuyPrice () {
        const self = this
        self.buyPrice = await self._getBuyPrice()
    }
    getBuyPrice = async () => await this._getBuyPrice()
    async _getBuyPrice () {
        const self = this
        let weiBuyPrice = 0

        try {
            weiBuyPrice = await self.contract.buyPrice()
        } catch (e) {
            if (typeof e === TypeError) {
                throw AbiMismatchError(e.message)
            }
        }
        
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

    loadDividends = async () => await this._loadDividends()
    async _loadDividends () {
        const self = this
        self.referralDividends = await self.getDividends(true)
        self.normalDividends = await self.getDividends(false)
        return [self.normalDividends, self.referralDividends]
    }
    getDividends = async (r) => await this._getDividends(r)
    async _getDividends (referral) {
        const self = this
        if (self.account === null) {
            return 0
        }

        let divs = await self.account.myDividends(false)
        let divsAndRefs = await self.account.myDividends(true)
        divs = self.convertWeiToEth(divs)
        divsAndRefs = self.convertWeiToEth(divsAndRefs)
        const referrals = divsAndRefs - divs

        if (referral) {
            return referrals
        } else {
            return divs
        }
    }

    needsLoading () {
        const self = this

        if (self.networkChanged) {
            return true
        }

        return Boolean(window.ethereum)
    }

    getCurrentAddress () {
        return window.ethereum.selectedAddress
    }

    isChainInvalid = () => this._isChainInvalid()
    _isChainInvalid () {
        const self = this
        const chainID = self.chainID

        console.log('CHAINID', chainID, self.chainID)
        if (chainID !== null) {
            if (chainID === 56) {
                return false
            }
        }

        return true
    }

    isConnected = () => this._isConnected()
    _isConnected () {
        const self = this

        return (
            (self.account !== null) &&
            (self.tokenBalance !== null) &&
            !self._isChainInvalid()
        )
    }

    login = () => this._login()
    _login () {
        const self = this
        const address = self.getCurrentAddress()
        Misc.assert(address !== null)

        self.signer = self.provider.getSigner(address)
        self.account = self.contract.connect(self.signer)
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
                self.login()

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
            self.login()

            return window.web3
        }
        // Non-dapp browsers...
        else {
            console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
            return false
        }
    }

    getContractWei = async () => await this._getContractWei()
    async _getContractWei () {
        const self = this
        return await self.provider.getBalance(
            self.contractAddress
        );
    }

    convertWeiToEth (e) { return e / 1e18 }

    updateContractStats = async () => await this._updateContractStats()
    async _updateContractStats () {
        const self = this
        try {
            self.balance = await self.getContractBalance()
            self.tokens = await self.getContractTokens()
        } catch (e) {
            if (typeof e === TypeError) {
                throw AbiMismatchError(e.message)
            }

            console.error(e)
        }
    }

    getContractBalance = async () => await this._getContractBalance()
    async _getContractBalance () {
        // get contract balance
        const self = this
        const weiBalance = await self.getContractWei()
        const ethBalance = self.convertWeiToEth(weiBalance)
        return ethBalance
    }

    loadTokenBalance = async () => await this._loadTokenBalance()
    async _loadTokenBalance () {
        const self = this
        self.tokenBalance = await self._getTokenBalance()
        return self.tokenBalance
    }

    getTokenBalance = async () => await this._getTokenBalance()
    async _getTokenBalance () {
        const self = this
        const address = self.getCurrentAddress()
        // console.log('ADDRESS', address)
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

    getContractTokens = async () => await this._getContractTokens()
    async _getContractTokens () {
        // get contract balance
        const self = this
        let supply = await self.contract.totalSupply()
        supply = self.convertWeiToEth(supply)
        return supply
    }

    updateBngPrice = async () => await this._updateBngPrice()
    async _updateBngPrice () {
        const self = this
        const price = await Promise.race([
            self.fetchBngPrice(),
            Misc.sleepAsync(2000)
        ])
        
        console.log('NEW PRICE', price)
        if (price === undefined) { return }
        self.bngPrice = price
        return price
    }

    fetchBngPrice = () => this._fetchBngPrice()
    _fetchBngPrice () {
        const self = this
        const currency = 'usd'
        const baseurl = 'https://api.coingecko.com/api/v3/simple/price'
        const url = `${baseurl}?ids=binancecoin&vs_currencies=${currency}`
        const args = {
            headers: { "Content-Type": "application/json" }
        };
        
        // console.log('FETH PRICE')
        return new Promise((resolve) => {
            self.httpClient.get(url, args, (data) => {
                // console.log('PRICE DATA', data)
                
                let bng = 0;
                bng = data.binancecoin[currency]
                const price = parseFloat(bng + currency.toLowerCase())
                resolve(price)

                // console.log('PRICE', price)
            })
        }).catch((alert) => {
            console.error('ERROR', alert)
        })
    }
}

export default BngContract