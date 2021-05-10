import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";

// COMPONENTS
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import DashboardLogic from './DashboardLogic';

const Dashboard = () => {
  const {
    getData,
    doSearch,
    search,
    myNFTs,
    filters,
    // account
  } = DashboardLogic();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="container-app">
      <Header dashboard={true} doSearch={doSearch} search={search}/>
      {/* {account ? */}
        <Row className="m-0 p-0" style={{height: '92vh'}}>
          <Sidebar dashboard={true} filters={filters}/>
          <Row className='dashboard-items-container'>
            {myNFTs.map((element, key) => (
              <div className="dashboard-item-card" key={key}>
                <Link to={`/item/${element.id}`}>
                  <div className='dashboard-item-card-picture'>
                    <img src={element.data.image} alt="" style={{width: '100%', height: '100%', borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}/>
                  </div>
                </Link>
                <Row className='dashboard-item-card-body m-0'>
                  <Col sm={12} className="m-0 p-0 text-center">
                    <p style={{textDecoration: "underline", margin: 0}}>{element.data.name}</p>
                  </Col>
                  <Col sm={9} className="m-0 p-0">
                    <p style={{margin: 0, fontSize: '0.9rem'}}>{element.data.description}</p>
                  </Col>
                  <Col sm={3} className="m-0 p-0 text-center">
                    {/* <p style={{fontSize:'0.9rem', color: '#aaaaaa', margin: 0}}>Price</p>
                    <p style={{margin: 0}}>{element.price} <span style={{fontSize: '0.8rem'}}>eth</span></p> */}
                    <p style={{fontSize:'0.9rem', color: '#aaaaaa', margin: 0}}>Amount</p>
                    <p style={{margin: 0}}>{element.amount}</p>
                  </Col>
                </Row>
              </div>
            ))}
          </Row>
        </Row>
      {/* :
        <Row className="m-0 p-0" style={{height: '90vh', fontSize: '2rem'}}>
          <Col sm={8} md={4} style={{margin: 'auto', textAlign: 'center'}}>
            Connect your wallet
            <br/>
            to see the collections
            <Button
              className="rounded-pill mb-4 w-50 m-auto"
              size="md"
              variant="outline-secondary"
              onClick={connectWeb3}
            >
              Connect Web3
            </Button>
          </Col>
        </Row>
    } */}
    </div>
  );
}

export default Dashboard;