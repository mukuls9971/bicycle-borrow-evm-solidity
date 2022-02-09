import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import  {abi as biftabi }  from  "../build/contracts/Bift.json";
import  {abi as nftabi }  from  "../build/contracts/BicycleNFT.json";
import  {abi as shopabi }  from  "../build/contracts/BicycleShop.json";
import Form from "./components/Form";
import Interactions from './Interactions';

const Wallet = () => {

	// ganache-cli address
	const biftAddress = '0x7C3E7118D50CB4b94C39eE79554810B61AD8B36e';
	const nftAddress = '0x6bD1D100500E57f7572c78534a58f59b8248C7B6';
	const shopAddress = '0xf6E823b864717617e0ebF59808E6859798644a42';
	const alice = '0x9c383e7F9e03958df2c1EA161Ccc4D21CeBf1D17';
	const bob = '0xf11e0b9eb264476639Ae6866886578f4dfdd2927';
	const shopowner = '0x92E981DDBbeE96E38F684D7cE429B64623C20080';

	const [tokenName, setTokenName] = useState("Token");
	const [connButtonText, setConnButtonText] = useState("Connect Wallet");
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [balanceA, setBalanceA] = useState(null);
	const [balanceB, setBalanceB] = useState(null);
	const [balanceS, setBalanceS] = useState(null);
	const [balanceSC, setBalanceSC] = useState(null);
	const [transferHash, setTransferHash] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [bift, setBift] = useState(null);
	const [nft, setNft] = useState(null);
	const [shop, setShop] = useState(null);

	const [offers, setOffers] = useState([]);
	const [balance, setBalance] = useState('0');
	
	useEffect(() => {
		if (bift != null) {
			updateBalance();
			updateTokenName();
		}
	}, [bift])

	const viewSubmit = async event => {
	  event.preventDefault();
	  	const offers = await shop.getOffers();
		console.log("offers",offers);
		setOffers(offers);
	  
	}

	const transferHandler = async (e) => {
		e.preventDefault();
		let transferAmount = e.target.sendAmount.value;
		let recieverAddress = e.target.recieverAddress.value;

		let txt = await bift.transfer(recieverAddress, transferAmount);
		setTransferHash(txt.hash);
	}

	const mintSubmit = async event => {
	  event.preventDefault();
	  const { fieldset, message } = event.target.elements;
	//   fieldset.disabled = true;
	  const msg = JSON.parse(message.value);
	  console.log(msg );
	  let txt = await nft.createBicycle(msg.title, msg.description) // {"title": "Hero2016", "description":"hero 2016 model"}
	  setTransferHash(txt.hash);
	//   fieldset.disabled = false;
	}

	const approveSubmit = async event => {
	  event.preventDefault();
	  const { fieldset, message } = event.target.elements;
	  const msg = JSON.parse(message.value);
	  console.log(msg );
	  let txt = await shop.createOffer(msg.tokenID, nft.address, msg.rent, msg.expiry, msg.guarantee);// {"tokenID": 0,"rent": 2,"expiry": 300, "guarantee": 2000}
	  setTransferHash(txt.hash);
	}

	const borrowSubmit = async event => {
	  event.preventDefault();
	  const { fieldset, message } = event.target.elements;
	  const msg = JSON.parse(message.value);
	  console.log(msg );
	  let txt = await bift.approve(shop.address, msg.amount) // {"amount": 2000, "tokenId":0, "expiry": 5}
	  console.log("txt1", txt);
      let shopAllowance = await bift.allowance(bob, shop.address)
	  console.log("shopAllowance", shopAllowance.toString())
      txt = await shop.borrow(msg.tokenId, nft.address, msg.expiry);
	  console.log("txt2", txt);
	  setTransferHash(txt.hash);
	}
	const liqSubmit = async event => {
	  event.preventDefault();
	  const { fieldset, message } = event.target.elements;
	  const msg = JSON.parse(message.value);
	  console.log(msg );
	  let txt = await shop.liquidate(msg.tokenId) // {"tokenId": 0 }
	  console.log("txt", txt);
	  setTransferHash(txt.hash);
	}
	const withSubmit = async event => {
	  event.preventDefault();
	  const { fieldset, message } = event.target.elements;
	  const msg = JSON.parse(message.value);
	  console.log(msg );
	  let txt = await shop.withdrawGuarantee(msg.tokenId) // {"tokenId": 0 }
	  console.log("txt", txt);
	  setTransferHash(txt.hash);
	}

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			})


		} else {
			console.log('need to install metamask');
			setErrorMessage('Please install MetaMask');
		}
	}

	const accountChangedHandler = (newAddress) => {
		setDefaultAccount(newAddress);
		updateEthers();
	}

	const updateEthers = () => {
		console.log("working awesome")
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);

		let tempSigner = tempProvider.getSigner();

		let tempBift = new ethers.Contract(biftAddress, biftabi, tempSigner)
		let tempNft = new ethers.Contract(nftAddress, nftabi, tempSigner)
		let tempShop = new ethers.Contract(shopAddress, shopabi, tempSigner)

		setProvider(tempProvider);
		setSigner(tempSigner);
		setBift(tempBift);
		setNft(tempNft);
		setShop(tempShop);
	}


	const updateBalance = async () => {
		let balanceShopBigN = await bift.balanceOf(shopowner);
		let balanceAliceBigN = await bift.balanceOf(alice);
		let balanceBobBigN = await bift.balanceOf(bob);
		let balanceShopContractigN = await bift.balanceOf(shopAddress);
		// let balanceNumber = balanceBigN.toNumber();
		
		// let decimals = 0; // await bift.decimals();

		// let tokenBalance = balanceNumber; // / Math.pow(10, decimals);

		setBalanceS(balanceShopBigN.toNumber());
		setBalanceA(balanceAliceBigN.toNumber());
		setBalanceB(balanceBobBigN.toNumber());
		setBalanceSC(balanceShopContractigN.toNumber());
		
	}

	const updateTokenName = async () => {
		setTokenName(await bift.name());
	}
	
return (
	
	<div>
		<h2> {tokenName + " ERC-20 Wallet"} </h2>
		<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

		<div className = "section" >
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div>
				<h3>{tokenName}</h3> 
				<h4>Shop Owner: {balanceS}, Alice: {balanceA}, Bob: {balanceB}, ShopContract: {balanceSC}</h4>
			</div>
			<div>
				transferHash: 	{transferHash}
			</div>
			{errorMessage}
		</div>
		<div className= "section">
			<h1>ViewOffers</h1>
			<button onClick={viewSubmit}>Refresh</button>
			{
				offers.map((data, key) => {
				return (
					<section key={key}>
					<p>owner_id:{data.owner}</p>
					<p>nft_contract_id:{data.nft}</p>
					<p>status:{data.state}</p>
					<p>rent:{data.rent.toNumber()}</p>
					<p>max_duration:{data.maxexpiry.toNumber()}</p>
					<p>lending_start:{data.starttime.toNumber()}</p>
					<p>lending_expiry:{data.expiry.toNumber()}</p>
					<p>user_rights:{data.borrower}</p>
					<p>********************************</p>
					</section>
				);
				})
			}
		</div> 
	
		<div className= "section">
			<form onSubmit={transferHandler}>
				<h3> Transfer Coins </h3>
					<p> Reciever Address </p>
					<input type='text' id='recieverAddress' className={styles.addressInput}/>

					<p> Send Amount </p>
					<input type='number' id='sendAmount' min='0' step='1'/>

					<button type='submit' className={styles.button6}>Send</button>		
			</form>
		</div>
		       
		<div className= "section">
			<h1>MintAndOffer</h1>     
			<Form onSubmit={mintSubmit} />
			<Form onSubmit={approveSubmit}/>
		</div>
      
		<div className= "section">
    		<h1>BorrowsToken</h1>
        	<Form onSubmit={borrowSubmit}/>
		</div>
		<div className= "section">
			<h1>Liquidation</h1>
			<Form onSubmit={liqSubmit} />
		</div>
		<div className= "section">
		<h1>WithDrawGuarantee</h1>
			<Form onSubmit={withSubmit} />
		</div>
			
	</div>
	 );
}

export default Wallet;