"use client";

import Bounty from "@/components/_bounty/Bounty";
import Footer from "@/components/_navbar/Footer";
import Navbar from "@/components/_navbar/NavbarHunter";
import Navbar2 from "@/components/_navbar/NavbarSponser";
import { useChain } from "@cosmos-kit/react";
// import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
// import { useToast } from "@chakra-ui/react";
import { CHAIN_NAME } from "@/config";

export default function Dashboard() {
  const [chainName, setChainName] = useState(CHAIN_NAME);
  function onChainChange(chainName?: string) {
    setChainName(chainName || CHAIN_NAME);
  }
  const { chain,
    status,
    wallet,
    username,
    address,
    message,
    connect,
    openView, } = useChain(localStorage.getItem("selected-chain"));
  const [bounties, setBounties] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [user, setUser] = useState<any>("");
  const router = useRouter();
  
  console.log("chain_name", address,wallet);
  //   const toast = useToast()


  const fetchBounties = async () => {
    if (!address) router.push("/");

  
    try {
      const response = await fetch(
        `http://localhost:4000/api/get_sponser_profile/${address}`
      );
      console.log("response", response);
      if (response.ok) {
        const data: any = await response.json();
        if (data.userType === "") {
          // toast({
          //     title: 'Kindly create profile',
          //     status: 'info',
          //     duration: 2000,
          //     isClosable: true,
          // })
          router.push("/");
          return;
        }

        setLoading(true);
        const bountiesResponse = await fetch(
          data.userType === "sponser"
            ? `http://localhost:4000/api/get_sponser_bounties/${address}`
            : `http://localhost:4000/api/get_all_bounties`
        );
        if (bountiesResponse.ok) {
          const bountiesData: any = await bountiesResponse.json();
          setBounties(bountiesData);
          setLoading(false);
        } else {
          alert("Failed to load bounties");
        }

        localStorage.setItem("userType", data?.userType);
        setUser(data);
      } else {
        alert("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, [address]);

  return (
    <>
      {user?.userType === "hunter" ? <Navbar /> : <Navbar2 />}
      <div className="w-full mt-24 min-h-screen flex justify-center items-start">
        <div className="w-[1290px] h-full flex justify-between items-start flex-row">
          <div className="w-[65%] h-full border border-transparent border-r-gray-300 pr-4">
            <div className="flex gap-4">
              <button className="border-2 border-gray-400 rounded-3xl py-1 px-4 text-sm">
                Content
              </button>
              <button className="border-2 border-gray-400 rounded-3xl py-1 px-4 text-sm">
                Event
              </button>
              <button className="border-2 border-gray-400 rounded-3xl py-1 px-4 text-sm">
                Tech
              </button>
            </div>
            <div className="w-full rounded-lg p-6 text-white text-xl bg-slate-800 mt-4 mb-2">
              Welcome{" "}
              {user?.userType === "hunter"
                ? user?.user?.name
                : user?.user?.companyName}
            </div>
            {!loading ? (
              <Bounty bounties={bounties} userType={user?.userType} />
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <div className="loading"></div>
              </div>
            )}
          </div>
          <div className="flex justify-center items-start flex-col w-[34%]">
            <div className="flex justify-between items-center flex-row w-full bg-[#ecf4ff] p-6 rounded-lg">
              <div className="flex justify-center items-start flex-col w-1/2">
                <span className="font-bold text-lg">$ 55,000</span>
                <span className="text-center text-[12px] mt-2">
                  Total value earned
                </span>
              </div>
              <div className="w-[1px] h-[40px] bg-gray-400"></div>
              <div className="flex justify-center items-start ml-4 flex-col w-1/2">
                <span className="text-lg font-bold">14</span>
                <span className="text-center text-xs mt-2">
                  Opportunity Listed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
