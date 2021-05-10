import React from "react";
import {Row, Col} from 'react-bootstrap';

// COMPONENTS
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Upload from "../../components/Upload";

const CreateNFT = () => {
  return (
    <div className="container-app">
      <Header/>
      <Row className="m-0 p-0" style={{height: '92vh'}}>
        <Sidebar/>
        <Col sm={10} md={7} className="mx-auto my-5 create-card" >
          <div className="text-center m-5">
            <h1 className="mb-4">NFT Creation</h1>
            <Upload />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CreateNFT;