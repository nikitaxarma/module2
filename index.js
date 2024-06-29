import { useState, useEffect } from "react";
import { ethers } from "ethers";
import crypto_making_tree_abi from "../artifacts/contracts/Frontend.sol/Frontend.json";

export default function Homepage() {
    const [userMessage, setUserMessage] = useState("Account Holder Name: Nikita Sharma");
    const [defaultAccount, setDefaultAccount] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const [ethWallet, setEthWallet] = useState(undefined);
    const [Frontend, setFrontend] = useState(undefined);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const smcABI = crypto_making_tree_abi.abi;

    const getBalance = async() => {
        if (Frontend) {
            setBalance((await Frontend.getBalance()).toNumber());
        }
    };

    const topUp = async() => {
        if (Frontend) {
            let tx = await Frontend.topUp(1);
            await tx.wait();
            getBalance();
        }
    };

    const cashOut = async() => {
        if (Frontend) {
            let tx = await Frontend.cashOut(1);
            await tx.wait();
            getBalance();
        }
    };

    const verifyAddress = async() => {
        if (Frontend) {
            try {
                const result = await Frontend.verifyAddress(defaultAccount[0]);
                setVerificationResult(result);
            } catch (error) {
                console.error("Error verifying address:", error);
                setVerificationResult("Error verifying address");
            }
        }
    };

    const accessTransaction = async() => {
        if (Frontend) {
            try {
                const txResult = await Frontend.accessResource();
                console.log("Access Transaction Result:", txResult);
            } catch (error) {
                console.error("Error during access transaction:", error);
            }
        }
    };

    const displayAddress = async() => {
        if (Frontend) {
            let tx = await Frontend.displayAddress();
            await tx.wait();
        }
    };

    const getWallet = async() => {
        if (window.ethereum) {
            setEthWallet(window.ethereum);
            console.log("getWallet is executed");
        }

        if (ethWallet) {
            const account = await ethWallet.request({ method: "eth_accounts" });
            accountHandler(account);
        }
    };

    const accountHandler = async(accounts) => {
        if (accounts) {
            console.log("Account connected =", accounts);
            setDefaultAccount(accounts);
        } else {
            console.log("Account Not Located");
        }
    };

    const connectWalletHandler = async() => {
        if (!ethWallet) {
            alert("MetaMask Wallet is required to Connect");
            return;
        }

        const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
        accountHandler(accounts);
        getMyContract();
    };

    const getMyContract = async() => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, smcABI, signer);

        setFrontend(contract);
    };

    const initUser = () => {
        if (!ethWallet) {
            return <p > Please install the MetaMask browser extension to
            continue < /p>;
        }
        if (!defaultAccount) {
            return ( <
                button onClick = { connectWalletHandler }
                style = {
                    { color: "white", background: "DarkRed" } } >
                <
                h3 > Connect Wallet < /h3> <
                /button>
            );
        }

        getBalance();

        return ( <
            div >
            <
            h3 style = {
                { color: "DarkBlue" } } > User Account: { defaultAccount } < /h3> <
            p style = {
                { color: "DarkGreen" } } > User Balance: { balance } < /p> <
            button onClick = { displayAddress }
            style = {
                { color: "Yellow", background: "DarkBlue" } } >
            <
            h3 > Verify Address < /h3> <
            /button> <
            button onClick = { topUp }
            style = {
                { color: "White", background: "DarkGreen" } } >
            <
            h3 > Top Up Balance < /h3> <
            /button> <
            button onClick = { cashOut }
            style = {
                { color: "Black", background: "LightGreen" } } >
            <
            h3 > Cash Out < /h3> <
            /button> <
            button onClick = { accessTransaction }
            style = {
                { color: "White", background: "DarkOrange" } } >
            <
            h3 > Access Transaction < /h3> <
            /button> <
            /div>
        );
    };

    useEffect(() => {
        getWallet();
    }, []);

    return ( <
        main className = "homepage" >
        <
        h1 >
        <
        marquee width = "60%"
        direction = "left"
        height = "80%" >
        Welcome to my bank!
        <
        /marquee> <
        /h1> <
        h2 > { userMessage } < /h2> { initUser() } <
        style jsx > { `
        .homepage {
          background-image: url("https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjBza3l8ZW58MHx8MHx8fDA%3D&w=1000&q=80");
          background-position: center;
          background-size: cover;
          width: 100%;
          height: 100vh;
          text-align: center;
          color: Black;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      ` } < /style> <
        /main>
    );
}