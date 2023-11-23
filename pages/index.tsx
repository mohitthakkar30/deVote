import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ABI from "../abi/votingABI";
import { ethers, Signer } from "ethers";
import { fetchSigner } from "@wagmi/core";
import { useAccount } from "wagmi";
import "bootstrap/dist/css/bootstrap.min.css";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [response, setResponse] = useState([0,0,0,0]);
  const contractAddress = "0xcFF76d06F90af2668d7a259a2C12C3b88a1A13F3";
  const votee = ["Vitalik", "JD", "Satoshi", "Sandeep"];

  const getResult = async () => {
    const res: any = [];
    const signer: any = await fetchSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    for (let i = 0; i < votee.length; i++) {
      res.push(
        await contract.getVoteTally(votee[i]).then((res: any) => res.toString())
      );
    }
    setResponse(res);
    
    console.log("res - ", res);
  };
  // const { address } = useAccount();
  const vote = async () => {
    try {
      const signer: any = await fetchSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.vote(name);
      await tx.wait();
      setName("");
      getResult();
    } catch (e: any) {
      alert(e.reason);
    }
  };

  const addVoter = async () => {
    const signer: any = await fetchSigner();
    try {
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.registerVoter(voterAddress);
      await tx.wait();
      setVoterAddress("");
    } catch (e: any) {
      alert(e.reason);
    }
  };

  return (
    <div>
      <Head>
        <title>Voting</title>
      </Head>
      <div className="container mx-auto flex items-center justify-between bg-red-400">
        <h1 className="text-4xl">Voting</h1>
        <ConnectButton />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-center items-center bg-yellow-500">
          <select onChange={(e) => setName(e.target.value)}>
            <option selected>Select to vote</option>
            <option value="Vitalik">Vitalik</option>
            <option value="JD">JD</option>
            <option value="Satoshi">Satoshi</option>
            <option value="Sandeep">Sandeep</option>
          </select>
          <button className="bg-blue-500" onClick={vote}>
            Vote
          </button>
        </div>
        <div className="bg-green-500">
          <input
            type="text"
            placeholder="Enter address to give permission for vote"
            onChange={(e) => setVoterAddress(e.target.value)}
          />
          <button className="bg-blue-500" onClick={addVoter}>
            Add Voter
          </button>
        </div>
        <div>
          <h1>Results</h1>
          <button className="bg-blue-500" onClick={getResult}>
            Get Result
          </button>
          <table>
            <tr>
              <th>Candidate</th>
              <th>Votes</th>
            </tr>
            <tr>
              <td>Vitalik</td>
              <td>{response[0]}</td>
            </tr>
            <tr>
              <td>JD</td>
              <td>{response[1]}</td>
            </tr>
            <tr>
              <td>Satoshi</td>
              <td>{response[2]}</td>
            </tr>
            <tr>
              <td>Sandeep</td>
              <td>{response[3]}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
