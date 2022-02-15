import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

//Home cooked goodies
import Web3 from 'web3';
import Token from '../abis/Token.json';
import SharedWallet from '../abis/SharedWallet.json';

import Contract from '../abis/Contract.json';

import {getAccountData} from '../helpers';

class App extends Component {

  async componentWillMount() {
    console.log("Component mounted...")
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3 () {
    console.log("loadWeb3");
    if (window.ethereum) {
      console.log("loadWeb3: ethereum window");
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    } else if (window.web3) {
      console.log("loadWeb3: web3 window");
      window.web3 = new  Web3(window.web3.currentProvider)
    }//end iffy
    else {
      window.alert('Non-Ethereum browser detected! Please connect to MetaMask')
    }//end iffy else
  }//end loadWeb3

  async loadBlockChainData () {
    console.log("loadBlockChainData");

    const web3 = window.web3;
    //cooper s - get  all the account data at once....
    const accountData = await getAccountData(web3)
    console.log("accountData: ", accountData );

    this.setState({account: accountData.account });
    this.setState({accountName: accountData.accountName});
    this.setState ({balance: window.web3.utils.fromWei(accountData.accountBalance)});
    this.setState ({networkId: accountData.networkInfo.network} );

    // Identify which network we're on
    let networkId = accountData.networkInfo.id;
    console.log("Current network ID: ", networkId)
    //cooper s - set the network id to mumbai only for now...
    const networkData = "80001"; //Token.networks[networkId]
    console.log("Current network Data: ", networkData)

    //create a local version of the network contract
    // We have our contract and the network its located on
    if (networkData) {

      //cooper s - pull up our test contract


      const contract = new web3.eth.Contract(Contract, "0xc4c1b3255d3312f91128677fb699c48beff4a77e");
      //console.log("New Contract: ", contract.methods )
      this.setState({contract});
      const contractBalance = await contract.methods.getBalance().call()
      console.log("Contract Balance: ", contractBalance.toString());

      this.setState({contractAddr: contract.address})
      //cooper s - Custom Token - can modify to any token I wish
  
      this.setState({loading: false});
    } else {
      window.alert("Smart contract not available on network: " + this.state.networkId )
    }

  }//end loadBlockChainData


async getBalance() {
  console.log("getBalance - current wallet balance: ", this.state.balance );
  console.log("getBalance - current contract balance: ", this.state.tokenBalance );
  const newBalance = await this.state.contract.methods.getBalance().call()
  console.log("Contract Balance: ", newBalance.toString());
  this.setState({balance: newBalance.toString()})
}//end getBalance

  async depositFunds ( amount) {
  console.log("Depositing Funds: ", amount );
    try {

      console.log("depositing  to : ", this.state.contract.address );

      const receipt = await  this.state.contract.methods.depositIt().send({ 
        from: this.state.contractOwner,
        gas: 80000,
        value: amount, 
        }).then( (receipt) =>  {
            console.log(`Transaction hash: ${receipt.transactionHash}`);
        })

      console.log("I think we're done here...")
    }     
    catch (error) {
      console.log("Could not complete transfer: ", error)
    }
  }//end tranfer


    //set initial state props
    constructor(props){
      super(props);
      this.state = {
        account: '',
        balance: 0,
        networkId: '',
        contract: {}, 
        contractOwner: 'Null',
        contractAddr: 'Null',
        token: null,
        tokenBalance: '',
        daiBalance:'',
        daiToken: null,
        transactions: [],
        txHash: '',
      }//end state

      //Bind transfer function
      this.depositFunds = this.depositFunds.bind(this);
      this.getBalance = this.getBalance.bind(this);
    }//end props  

  render() {
    return (
      <div>
        TEST
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Crypto Tools
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto" style={{width: "350px"}}>
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                > 
                  <img src={logo} width="25%" alt="logo" />
                </a>
                <br/><br/>
                <h1>Polygon Shared Wallet</h1>
                <br/>
                <p>Please Enter the amount you would like to deposit<br/>
                <code>(Polygon Mumbai</code> transactions only)</p>
                <p>
                <b>Current Balance:</b> {this.state.balance}  ETH/MATIC <br/>
                <button onClick={()=>this.getBalance()}>Check Balance</button><br/>
                <b>Deposit Transaction Hash: </b> {this.state.txHash }<br/>  
                <br/>
  
                </p>
                  <form onSubmit={ (event) =>{
                    event.preventDefault()
                  //  const recipient = this.recipient.value
                    const amount = window.web3.utils.toWei(this.amount.value);
                    console.log("Submitting amount: ", amount );

                  }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input}}
                      className="form-control"
                      placeholder = "Amount"                                                                                                                             
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" onClick={()=>this.depositFunds(this.amount.value) }>Deposit Funds</button>
                  <button type="submit" className="btn btn-primary btn-block">WithDraw Funds</button>
                  <button type="submit" className="btn btn-primary btn-block">Emergency WithDraw</button>
                </form>
                  <br/><br/>
                <span style={{bottom: "10px"}}>
                </span>
                <div className ="text-left">
                  <b>Network:</b> {this.state.networkId}
                  <br/>
                  <b>Account:</b> {this.state.accountName} 
                  <br/>
                  <b>MATIC Account Balance:</b> {this.state.balance }
                  <br/>
                  <div>
                  <b>Contract Owner: </b> {this.state.contractOwner}
                  <br />
                  <b>Contract Address: </b> {this.state.contractAddr}
                </div>
            </div> 
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
