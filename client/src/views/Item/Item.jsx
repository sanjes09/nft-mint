import React from "react";
import { Row, Col, Spinner, Button, Modal, Form } from "react-bootstrap";
import './Item.css';

// COMPONENTS
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ItemLogic from './ItemLogic';

const Item = () => {
  const {
    buy,
    sell,
    setSellAmount,
    setSellPrice,
    setShowModal,
    view,
    setShowModalTransfer,
    setTransferTo,
    setTransferAmount,
    showModalTransfer,
    transfer,
    transferTo,
    transferAmount,
    isItemOwner,
    account,
    showModal,
    loadingBuy,
    loadingSell,
    loading,
    item,
    sellOffers,
    sellPrice,
    sellAmount,
    loadingTransfer,
  } = ItemLogic();

  return (
    <div className="container-app">
      <Header/>
      <Row className="m-0 p-0" style={{height: '92vh'}}>
        <Sidebar/>
        <Row className='item-container-1'>
        {loading ?
          <div className='p-4 m-auto'>
            <Spinner animation="grow" variant="primary" style={{marginRight: '0.5rem'}}/>
          </div>
          :
          <div className="item-container row p-3">
            <Col sm={5}>
              <div className="my-3 mx-auto" style={{width: '80%', height: '40vh'}}>
                <div style={{border: '1px solid', padding: "10px", borderRadius: '10px'}}>
                  <img src={item?.data?.image} alt="" style={{width: '100%', height: '100%'}}/>
                </div>
                <p className='mt-5' style={{cursor: 'pointer', color: "blue"}} onClick={view}>View on OpenSea</p>
              </div>
            </Col>
            <Col sm={7}>
              <p>Name: {item?.data?.name}</p>
              <p>Description: {item?.data?.description}</p>
              <p>Properties: </p>
              <div className="p-4 bg-light">
                {item?.data?.attributes?.map((element,key) => (
                  <p key={key}>{element.trait_type}: {element.value}</p>
                ))}
              </div>
              <div className="w-75 mt-3 item-card p-3">
                <Row style={{borderBottom: '1px solid lightgrey', justifyContent: 'center', alignItems: 'center', padding: '10px 0px'}}>
                  <Col sm={8}>
                    <p style={{margin: 0}}>Sell offers</p>
                  </Col>
                  <Col sm={4} className="d-flex">
                  {isItemOwner && 
                    <>
                      <Button variant="danger" style={{margin: 'auto', height: 'fit-content'}} size="sm" onClick={()=>setShowModal(true)} disabled={loadingSell}>
                        {loadingSell ? <Spinner size="sm" animation="grow" variant="light"/>: "Sell"}
                      </Button>
                      <Button variant="primary" style={{margin: 'auto', height: 'fit-content'}} size="sm" onClick={()=>setShowModalTransfer(true)}>
                        Transfer
                      </Button>
                    </>
                  }
                  </Col>
                </Row>
                <Row className="p-0 m-0 mt-2">
                  <Col sm={4} className='super-center'>Unit price</Col>
                  <Col sm={3} className='super-center'>Quantity</Col>
                  <Col sm={4} className='super-center'>Total price</Col>
                  <Col sm={1} className='super-center'></Col>
                </Row>
                {sellOffers?.map((element, key) => (
                  <Row key={key} className="p-0 m-0 py-2" style={{borderTop: '1px solid lightgrey'}}>
                    <Col sm={4} className='super-center'>{((Number(element.currentPrice)/(10**18))/Number(element.quantity)).toFixed(3)}</Col>
                    <Col sm={3} className='super-center'>{Number(element.quantity)}</Col>
                    <Col sm={4} className='super-center'>{Number(element.currentPrice)/(10**18)}</Col>
                    <Col sm={1} className='super-center'>
                      {(!account || element.maker !== account.toLowerCase()) && 
                        <Button variant="success" size="sm" onClick={()=>buy(element)} disabled={loadingBuy}>
                          {loadingBuy ? <Spinner size="sm" animation="grow" variant="light"/>: "Buy"}
                        </Button>
                      }
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
            {/* <Col sm={12}>
              Trading History
            </Col> */}
          </div>
        }
        </Row>
      </Row>

      <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Sell Price</Form.Label>
            <Form.Control type="number" onChange={(e)=>setSellPrice(e.target.value)} value={sellPrice}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Sell Amount</Form.Label>
            <Form.Control type="number" onChange={(e)=>setSellAmount(e.target.value)} value={sellAmount}/>
          </Form.Group>
          <div className='text-center'>
            <Button variant="danger" onClick={()=>sell()} disabled={loadingSell}>
              {loadingSell ? <Spinner size="sm" animation="grow" variant="light"/>: "Sell"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showModalTransfer} onHide={()=>setShowModalTransfer(false)}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" onChange={(e)=>setTransferTo(e.target.value)} value={transferTo}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Amount of tokens</Form.Label>
            <Form.Control type="number" onChange={(e)=>setTransferAmount(e.target.value)} value={transferAmount}/>
          </Form.Group>
          <div className='text-center'>
            <Button variant="primary" onClick={transfer} disabled={loadingTransfer}>
              {loadingTransfer ? <Spinner size="sm" animation="grow" variant="light"/>: "Transfer"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Item;