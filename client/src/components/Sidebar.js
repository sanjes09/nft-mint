import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Button, Accordion, Card, Form, Spinner } from "react-bootstrap";
import { Link } from 'react-router-dom';
// import filter from '../assets/Sauara Things-05.svg';
import collections from '../assets/Sauara Things-04.svg';
import category from '../assets/Sauara Things-06.svg';
import down from '../assets/Sauara Things-08.svg';
import Swal from 'sweetalert2'

import { Web3Context } from "../web3";

export default function Header(props) {
  const { connectWeb3, account, logout, isOwner, newOwner, removeOwner } = useContext(Web3Context);
  
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(false);
  const [option, setOption] = useState(null);
  // const [chec1, setChec1] = useState(false);
  // const [chec2, setChec2] = useState(false);

  const change = (opt) => {
    if(option === opt) setOption(null)
    else setOption(opt)
  }

  const make = async () => {
    setLoading(true);
    try {
      await newOwner(owner);
      Swal.fire({
        title: 'Added!',
        icon: 'success',
        text: '',
      })
      setLoading(false)
    } catch (error) {
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
      setLoading(false)
    }
  }

  const unmake = async () => {
    setLoading(true);
    try {
      await removeOwner(owner);
      Swal.fire({
        title: 'Removed!',
        icon: 'success',
        text: '',
      })
      setLoading(false)
    } catch (error) {
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
      setLoading(false)
    }
  }

  useEffect(() => {
    isOwner().then(resp => {
      setAuth(resp)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Row className='sidebar-container m-0 p-0'>
      <Col sm={12} className="m-0 p-0">
        <Accordion style={{width: '100%'}}>
          {/* {props.dashboard &&
            <Card className="sidebar-card">
              <Accordion.Toggle as={Card.Header} eventKey="0" className='sidebar-card-header' onClick={()=>change(0)}>
                <Row>
                  <Col sm={3} className="text-center">
                    <img src={filter} alt="" style={{width: '20px', height: '20px'}}/>
                  </Col>
                  <Col sm={7}>
                    Filter
                  </Col>
                  <Col sm={2}>
                    {option === 0 ? 
                      <img src={down} alt="" style={{width: '15px', height: '15px', transform: "rotate(180deg)"}}/>
                    : 
                      <img src={down} alt="" style={{width: '15px', height: '15px'}}/>
                    }
                  </Col>
                </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0" className='sidebar-card-body'>
              </Accordion.Collapse>
            </Card>
          } */}

          <Link to="/" style={{textDecoration: 'none', color: "black"}}>
            <Card className="sidebar-card">
              <div className="sidebar-card-header">
                  <Row>
                    <Col sm={3} className="text-center">
                      <img src={collections} alt="" style={{width: '20px', height: '20px'}}/>
                    </Col>
                    <Col sm={7}>
                      Home
                    </Col>
                    <Col sm={2}>
                    </Col>
                  </Row>
              </div>
            </Card>
          </Link>

          {auth && 
            <Card className="sidebar-card">
              <Accordion.Toggle as={Card.Header} eventKey="3" className='sidebar-card-header' onClick={()=>change(2)}>
                  <Row>
                    <Col sm={3} className="text-center">
                      <img src={category} alt="" style={{width: '20px', height: '20px'}}/>
                    </Col>
                    <Col sm={7}>
                      Add new admin
                    </Col>
                    <Col sm={2}>
                    {option === 2 ? 
                      <img src={down} alt="" style={{width: '15px', height: '15px', transform: "rotate(180deg)"}}/>
                    : 
                      <img src={down} alt="" style={{width: '15px', height: '15px'}}/>
                    }
                    </Col>
                  </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="3" className='sidebar-card-body'>
                <Card.Body style={{textAlign: 'center'}}>
                  <Form.Group>
                    <Form.Label>
                      Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    className="rounded-pill w-50 mx-auto"
                    size="md"
                    variant="outline-secondary"
                    onClick={make}
                  >
                    {loading ? 
                      <Spinner animation="grow" variant="secondary" size="sm"/>
                    : 
                      "Send"
                    }
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          }

          {auth && 
            <Card className="sidebar-card">
              <Accordion.Toggle as={Card.Header} eventKey="4" className='sidebar-card-header' onClick={()=>change(3)}>
                  <Row>
                    <Col sm={3} className="text-center">
                      <img src={category} alt="" style={{width: '20px', height: '20px'}}/>
                    </Col>
                    <Col sm={7}>
                      Remove admin
                    </Col>
                    <Col sm={2}>
                    {option === 3 ? 
                      <img src={down} alt="" style={{width: '15px', height: '15px', transform: "rotate(180deg)"}}/>
                    : 
                      <img src={down} alt="" style={{width: '15px', height: '15px'}}/>
                    }
                    </Col>
                  </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="4" className='sidebar-card-body'>
                <Card.Body style={{textAlign: 'center'}}>
                  <Form.Group>
                    <Form.Label>
                      Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    className="rounded-pill w-50 mx-auto"
                    size="md"
                    variant="outline-secondary"
                    onClick={unmake}
                  >
                    {loading ? 
                      <Spinner animation="grow" variant="secondary" size="sm"/>
                    : 
                      "Send"
                    }
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          }

          {auth && 
            <Link to="/mint-nft" style={{textDecoration: 'none', color: '#424242'}}>
              <Card className="sidebar-card">
                <Accordion.Toggle as={Card.Header} className='sidebar-card-header'>
                    <Row>
                      <Col sm={3} className="text-center">
                        <img src={category} alt="" style={{width: '20px', height: '20px'}}/>
                      </Col>
                      <Col sm={7}>
                        Create NFT
                      </Col>
                      <Col sm={2}>
                        {/* <img src={down} alt="" style={{width: '15px', height: '15px', transform: "rotate(270deg)"}}/> */}
                      </Col>
                    </Row>
                </Accordion.Toggle>
              </Card>
            </Link>
          }

        </Accordion>
      </Col>

      <Col sm={12} className="super-center m-0 p-0" style={{alignItems: 'flex-end'}}>
        {account ? 
          <div className='text-center'>
            <p className="w-100">
              Connected:{" "}
              <a
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                className="account-link"
                rel="noreferrer"
              >
                {account.substring(0, 4) +
                  "..." +
                  account.substring(38, 42)}
              </a>
            </p>
            <Button
              className="rounded-pill mb-4"
              size="md"
              variant="outline-secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        :
          <Button
            className="rounded-pill mb-4"
            size="md"
            variant="outline-secondary"
            onClick={connectWeb3}
          >
            Connect Web3
          </Button>
        }
      </Col>

    </Row>
  );
}
