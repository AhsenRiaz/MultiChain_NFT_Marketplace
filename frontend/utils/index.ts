import axios, { AxiosError, AxiosResponse } from "axios";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export const getSigner = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    return signer;
  } catch (err) {
    console.log("Error in openWeb3Modal", err);
  }
};

export const pinJSONtoIPFS = async (JSONBody: any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  try {
    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATE_KEY as any,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET as any,
        },
      })
      .then(function (res: AxiosResponse) {
        return {
          success: true,
          pinataUrl: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
        };
      })
      .catch(function (error: AxiosError) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  } catch (err) {}
};

export const pinIMAGEtoIPFS = async (image: any) => {
  const formData = new FormData();
  formData.append("file", image);
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  try {
    return axios
      .post(url, formData, {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATE_KEY as any,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET as any,
        },
      })
      .then(function (res: AxiosResponse) {
        return {
          success: true,
          pinataUrl: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
        };
      })
      .catch(function (error: AxiosError) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  } catch (err) {}
};
