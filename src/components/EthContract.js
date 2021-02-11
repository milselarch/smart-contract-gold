import { ethers } from "ethers";
import ABI from './ABI'

const CONTRACT_ADDR = '0x167cB3F2446F829eb327344b66E271D1a7eFeC9A'


class EthContract {
    constructor () {
        const self = this;

        self.contractAddress = CONTRACT_ADDR
        self.currentAddress = null;
        
        self.provider = new ethers.providers.Web3Provider(
            window.ethereum
        )

        console.log('CONTRACT', self.contractAddress)
        self.contract = new ethers.Contract(
            self.contractAddress, ABI, self.provider
        );
        
        self.walletMode = 'metamask'
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