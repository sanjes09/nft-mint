import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import Swal from 'sweetalert2'
import ipfs from "../utils/ipfs";
import { Web3Context } from "../web3";
import {CONTRACT_ADDRESS, CURRENT_NETWORK} from '../web3/constants';

// Upload Loan Details to IPFS and
// trigger Loan Creation to Smart Contract
export default function Upload() {
  const { account, mintToken } = useContext(Web3Context);

  // Component State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [price, setPrice] = useState("");
  // const [royalty, setRoyalty] = useState("");

  // Load File and convert to Buffer
  const loadFile = (_file) => {
    setFileName(_file.name);
    var reader = new FileReader();
    reader.readAsArrayBuffer(_file);
    reader.onloadend = () => {
      console.log(Buffer(reader.result));
      setFile(Buffer(reader.result));
    };
  };

  // Add content to IPFS and return HASH
  const addToIpfs = async (content) => {
    console.log("adding to IPFS...");
    const added = await ipfs.add(content, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return added.cid.toString();
  };

  // Request Loan to Blockchain Smart Contract
  const createToken = async () => {
    if(account){
      setLoading(true)
  
      const ipfsHash = await addToIpfs(file);
      const schema = {
        name,
        description,
        image: "ipfs://" + ipfsHash,
        attributes: [
          {
            trait_type: "Token amount",
            value: tokenAmount,
          },
          // {
          //   trait_type: "Original item price",
          //   value: price,
          // },
          // {
          //   trait_type: "Royalty porcentage",
          //   value: royalty,
          // },
        ],
      };
      const schemaHash = await addToIpfs(JSON.stringify(schema));
      console.log(`schemaHash`, schemaHash)
  
      // Trigger Tx to smart contract
      try {
        const idCreated = await mintToken(tokenAmount, schemaHash);

        setLoading(false)
        Swal.fire({
          title: 'NFT created!',
          icon: 'success',
          text: 'Needs manually set up on OpenSea',
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: `Ok`,
          confirmButtonText: `View in OpenSea`,
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(`https://${CURRENT_NETWORK!=="Mainnet"?"testnets.":''}opensea.io/assets/${CONTRACT_ADDRESS}/${idCreated}`)
          }
        })
      } catch (error) {
        setLoading(false)
        if(error.message === "MetaMask Tx Signature: User denied transaction signature."){
          Swal.fire(
            'Transaction signature denied',
            '',
            'error'
          )
        }else{
          Swal.fire(
            error.message,
            '',
            'error'
          )
        }
      }
    }else{
      Swal.fire(
        'Conection error',
        '',
        'error'
      )
      console.log("connect to eth")
    }
  };

  return (
    <Container>
      
      <Form className="mt-5">
        {/* Token Name */}
        <Form.Group as={Row}>
          <Form.Label column sm="3">
            Name
          </Form.Label>
          <Col sm="9" className="align-self-center">
            <Form.Control
              type="text"
              // placeholder="Token Name"
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Token Description */}
        <Form.Group as={Row}>
          <Form.Label column sm="3">
            Description
          </Form.Label>
          <Col sm="9" className="align-self-center">
            <Form.Control
              type="text"
              // placeholder="Token description details"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Token Amount */}
        <Form.Group as={Row}>
          <Form.Label column sm="3">
            Token amount
          </Form.Label>
          <Col sm="9" className="align-self-center">
            <Form.Control
              type="number"
              // placeholder="Amount"
              onChange={(e) => setTokenAmount(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* <Form.Group as={Row}>
          <Form.Label column sm="3">
            Item price (in ETH)
          </Form.Label>
          <Col sm="9" className="align-self-center">
            <Form.Control
              type="number"
              // placeholder="Sell amount"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="3">
            Royalty porcentage
          </Form.Label>
          <Col sm="9" className="align-self-center">
            <Form.Control
              type="number"
              // placeholder="Royalty porcentage"
              onChange={(e) => setRoyalty(e.target.value)}
            />
          </Col>
        </Form.Group> */}

      </Form>

      {/* File Upload */}
      {!file && (
        <>
          <div id="upload-container">
            <div id="fileUpload">
              <input
                id="file"
                type="file"
                name="file"
                className="inputfile"
                onChange={(e) => loadFile(e.target.files[0])}
              />
              <label htmlFor="file" id="fileLabel">
                <p>Upload File</p>
              </label>
            </div>
          </div>
          <p className="mb-5" style={{fontSize: '0.9rem'}}>
            Please upload a PNG, GIF, WEBP, or MP4 Max 30mb
          </p>
        </>
      )}
      {fileName && (
        <label htmlFor="file" className="mb-5">
          <strong>File Uploaded: </strong>
          {fileName}
        </label>
      )}

      <Button id="request-button" onClick={createToken} size="lg" disabled={loading} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto'}}>
        {loading ? <><Spinner animation="grow" variant="light" size="sm" style={{marginRight: '0.5rem'}}/>Creating...</> : "Create Token" }
      </Button>
    </Container>
  );
}
