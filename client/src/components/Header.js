import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import search from '../assets/search.png';
import logo from '../assets/logo.png';
// import search from '../assets/Sauara Things-07.svg';
// import drop from '../assets/Sauara Things-08.svg';

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   <span
//     className="header-dropdown"
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//   >
//     {children}
//     <img src={drop} alt="" style={{width: '15px', height: '15px', marginLeft: '1rem'}}/>
//   </span>
// ));

export default function Header(props) {
  
  return (
    <Row className="header-container mx-0">
      <Col sm={3} className="super-center">
        <Link to="/">
          <img src={logo} alt="" style={{width: '150px'}}/>
        </Link>
      </Col>
      <Col sm={5} className="super-center" style={{justifyContent: 'flex-start'}}>
        <input className="header-search" type="text" onChange={props.doSearch}/>
        <span style={{marginLeft: '-25px'}}><img src={search} alt="" style={{width: '15px', height: '15px'}}/></span>
      </Col>
      {/*<Col sm={2} className="super-center">
         {props.dashboard && 
          <Dropdown onClick={props.allItems}>
            <Dropdown.Toggle as={CustomToggle}>
              All items
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Option 1</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Option 2</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Option 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        } 
      </Col>*/}
      <Col sm={2} className="super-center">
        {/* {props.dashboard && 
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
              Highest Last Sell
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Option 4</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Option 5</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Option 6</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Option 6</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        } */}
      </Col>
    </Row>
  );
}
