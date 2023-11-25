import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ABI from "../abi/votingABI";
import { ethers, Signer } from "ethers";
import { fetchSigner } from "@wagmi/core";
import { useAccount } from "wagmi";
import "bootstrap/dist/css/bootstrap.min.css";
import { CircularProgress } from '@mui/material';


const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [response, setResponse] = useState([0, 0, 0, 0]);
  const contractAddress = "0xcFF76d06F90af2668d7a259a2C12C3b88a1A13F3";
  const votee = ["Vitalik", "JD", "Satoshi", "Sandeep"];
  const [isLoading, setIsLoading] = useState(false);
  const [addedVoter, setAddedVoter] = useState(false);
  const [voted, setVoted] = useState(false);


  const getResult = async () => {
    setIsLoading(true);
    const res: any = [];
    const signer: any = await fetchSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    for (let i = 0; i < votee.length; i++) {
      res.push(
        await contract.getVoteTally(votee[i]).then((res: any) => res.toString())
      );
    }
    setIsLoading(false);
    setResponse(res);

    // console.log("res - ", res);
  };
  // const { address } = useAccount();
  const vote = async () => {
    try {
      setVoted(true);
      const signer: any = await fetchSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.vote(name);
      await tx.wait();
      setName("");
      setVoted(false);
      getResult();
    } catch (e: any) {
      setVoted(false);
      alert(e.reason);
    }
  };

  const addVoter = async () => {
    setAddedVoter(true);
    try {
      const signer: any = await fetchSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.registerVoter(voterAddress);
      await tx.wait();
      setAddedVoter(false);
      setVoterAddress("");
    } catch (e: any) {
      alert(e.reason);
      setAddedVoter(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Voting</title>
      </Head>

      <nav>
        <h1 className="text-4xl">Voting</h1>

        <ConnectButton></ConnectButton>
      </nav>

      <div className="grid">
        <div className="center">
          <div className="wrapper">
            <select onChange={(e) => setName(e.target.value)}>
              <option selected>Select to vote</option>
              <option value="Vitalik">Vitalik</option>
              <option value="JD">JD</option>
              <option value="Satoshi">Satoshi</option>
              <option value="Sandeep">Sandeep</option>
            </select>
            <button className="vote-btn text-black" onClick={vote}>
              {voted ? <CircularProgress /> : "Vote"}
            </button>
          </div>
          <div className="wrapper">
            <input
              className="input-box"
              type="text"
              placeholder="Enter address to give permission for vote"
              onChange={(e) => setVoterAddress(e.target.value)}
            />
            <button className="vote-btn text-black" onClick={addVoter}>
              {addedVoter ? <CircularProgress /> : "Add Voter"}
            </button>
          </div>
        </div>

        <div className="center">
          <div className="center pd-1">
            <h2>Results</h2>
            <button  className="vote-btn result-btn text-black" onClick={getResult}>
            {isLoading ? <CircularProgress /> : "Get Result"}
            </button>
          </div>

          <table className="border border-collapse border-black">
            <tr>
              <th className="border">Candidate</th>
              <th className="border">Votes</th>
            </tr>
            <tr>
              <td className="border">Vitalik</td>
              <td className="border">{response[0]}</td>
            </tr>
            <tr>
              <td className="border">JD</td>
              <td className="border">{response[1]}</td>
            </tr>
            <tr>
              <td className="border">Satoshi</td>
              <td className="border">{response[2]}</td>
            </tr>
            <tr>
              <td className="border">Sandeep</td>
              <td className="border">{response[3]}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
