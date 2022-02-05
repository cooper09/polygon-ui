import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

//Home cooked goodies
import Web3 from 'web3';
import Token from '../abis/Token.json';
import SharedWallet from '../abis/SharedWallet.json';

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

      //const token = new web3.eth.Contract(Token.abi, networkData.address )
      const token = new web3.eth.Contract(SharedWallet.abi, "0xB7B9914D5B825ac3B5e3B457Ea0702Cc90BFC82B" )
      this.setState({token});

      console.log("Our Token Contract: ", token.address )
      this.setState({contractAddr: token.address})
      
      const tokenBalance = await token.methods.balanceOf().call()
      console.log("Token Balance: ", tokenBalance.toString());
    
      this.setState({tokenBalance: window.web3.utils.fromWei(tokenBalance.toString(),'Ether')})

    
      //cooper s - Custom Token - can modify to any token I wish
      let tokenName = await token.methods._owner().call()
      console.log("contractName: ", tokenName.toString() )
      this.setState({contractOwner: tokenName })


      this.setState({loading: false})
    } else {
      window.alert("Smart contract not available on network: " + this.state.networkId )
    }

  }//end loadBlockChainData


async getBalance() {
  console.log("getBalance - current wallet balance: ", this.state.balance );
  console.log("getBalance - current contract balance: ", this.state.tokenBalance );
}//end getBalance

  async depositFunds ( amount) {
  console.log("Depositing Funds: ", amount );

    
    try {
      // cooper s - This is for the original COOP coin
      //const done = await this.state.token.methods.deposit(amount ).send({from: this.state.account })
      
      // transfer dai token instead of coop coin
      //const done = await this.state.daiToken.methods.transfer(recipient, amount ).send({from: this.state.account })
      //if (!done) return

      console.log("depositing: ", amount );

      const done = await this.state.token.methods.deposit(amount).send({from: this.state.account })
      console.log("deposit transaction  hash: ", done );
      this.setState({txHash: done.blockHash })

      const tokenBalance = await this.state.token.methods.balanceOf().call()
     console.log("Token Balance: ", tokenBalance.toString())    
      this.setState({tokenBalance: window.web3.utils.fromWei(tokenBalance.toString(),'Ether')})

    //  alert("New Balance: "  + tokenBalance);

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
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://giddy.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            Giddy Tools
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto" style={{width: "350px"}}>
                <a
                  href="https://giddy.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                >hoy 
                  <img src={logo} width="25%" alt="logo" />
                </a>
                <br/><br/>
                <h1>Shared Wallet</h1>
                <br/>
                <p>Please Enter the amount you would like to deposit<br/>
                <code>(Polygon Mumbai</code> transactions only)</p>
                <p>
                <b>Current Balance:</b> {this.state.tokenBalance}  ETH <br/>
                <button onClick={()=>this.getBalance()}>Check Balance</button><br/>
                <b>Deposit Transaction Hash: </b> {this.state.txHash }<br/>  
                <br/>
  
                </p>
                  <form onSubmit={ (event) =>{
                    event.preventDefault()
                  //  const recipient = this.recipient.value
                    const amount = window.web3.utils.toWei(this.amount.value);
                    console.log("Submitting amount: ", amount );
                    //console.log("recipient: ", recipient," amount: ", amount );
                    //this.transfer(recipient, amount)

                    //this.recipient.value = "";
                    //this.amount.value = "";
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
