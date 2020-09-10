
import React, {useState, useEffect} from "react";
import { Dropdown, Modal, Button } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import { getTimeDifference } from "@utils";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import { Link } from "react-router-dom";
import MegaMenu from "@gull/components/MegaMenu";
import { merge } from "lodash";
import {
    setLayoutSettings,
    setDefaultSettings
  } from "app/redux/actions/LayoutActions";

import Signin from "../Signin";
import Signup from "../Signup"




const shorcutMenuList = [
    {
      icon: "i-Shop-4",
      link: "#",
      text: "Home"
    },
    {
      icon: "i-Library",
      link: "#",
      text: "Ui Kits"
    },
    {
      icon: "i-Drop",
      link: "#",
      text: "Apps"
    },
    {
      icon: "i-File-Clipboard-File--Text",
      link: "#",
      text: "Form"
    },
    {
      icon: "i-Checked-User",
      link: "#",
      text: "Sessions"
    },
    {
      icon: "i-Ambulance",
      link: "#",
      text: "Support"
    }
  ]

  const notificationList = [
    {
      icon: "i-Speach-Bubble-6",
      title: "New message",
      description: "James: Hey! are you busy?",
      time: "2019-10-30T02:10:18.931Z",
      color: "primary",
      status: "New"
    },
    {
      icon: "i-Receipt-3",
      title: "New order received",
      description: "1 Headphone, 3 iPhone",
      time: "2019-03-10T02:10:18.931Z",
      color: "success",
      status: "New"
    },
    {
      icon: "i-Empty-Box",
      title: "Product out of stock",
      description: "1 Headphone, 3 iPhone",
      time: "2019-05-10T02:10:18.931Z",
      color: "danger",
      status: "3"
    },
    {
      icon: "i-Data-Power",
      title: "Server up!",
      description: "Server rebooted successfully",
      time: "2019-03-10T02:10:18.931Z",
      color: "success",
      status: "3"
    }
  ]




const NewLayoutHeader = (props) =>{


  const [signupIsOpen, setsignUpIsOpen]  = useState(false);
    const [signinIsOpen, setsigninIsOpen]  = useState(false);
    const [navigate, setNavigation] = useState(false);

const toggleSignUp = () => {
    if(signinIsOpen){
        toggleSignIn();
    }
    setsignUpIsOpen(!signupIsOpen)
}

const toggleSignIn = () => {
    if(signupIsOpen){
        toggleSignUp();
    }
    setsigninIsOpen(!signinIsOpen)
}

const loginWithEmailAndPassword = ()=> {
    setNavigation(!navigate)


}

    const  handleMenuClick = () => {
        let { setLayoutSettings, settings } = props;
        setLayoutSettings(
          merge({}, settings, {
            layout1Settings: {
              leftSidebar: {
                open: settings.layout1Settings.leftSidebar.secondaryNavOpen
                  ? true
                  : !settings.layout1Settings.leftSidebar.open,
                secondaryNavOpen: false
              }
            }
          })
        );
      };
    
     const  toggleFullScreen = () => {
        if (document.fullscreenEnabled) {
          if (!document.fullscreen) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
        }
      };
    
      const handleSearchBoxOpen = () => {
        let { setLayoutSettings, settings } = props;
        setLayoutSettings(
          merge({}, settings, {
            layout1Settings: {
              searchBox: {
                open: true
              }
            }
          })
        );
      };

      return (

        <>

      <Modal show={signinIsOpen} onHide={toggleSignIn} size="lg" {...props}>
      <Modal.Header closeButton className="bg_public">
        <Modal.Title><span className="text-success">W</span><span>e</span><span className="text-success">X</span> Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Signin loginWithEmailAndPassword={loginWithEmailAndPassword} public={true}/>

      </Modal.Body>
      <Modal.Footer className="bg_public">
        <Button variant="secondary" onClick={toggleSignIn}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button> */}
      </Modal.Footer>
    </Modal>
 

 
    <Modal show={signupIsOpen} onHide={toggleSignUp} size="lg" {...props}>
      <Modal.Header closeButton className="bg_public">
        <Modal.Title>Sign Up on <span className="text-success">W</span><span>e</span><span className="text-success">X</span></Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Signup  public={true}/>

      </Modal.Body>
      <Modal.Footer className="bg_public">
        <Button variant="secondary" onClick={toggleSignUp}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button> */}
      </Modal.Footer>
    </Modal>


    <div className="main-header top-nav" >
        <div className="logo">
          <img src="/assets/images/logo.png" alt="" />
        </div>

        <div className="menu-toggle" onClick={handleMenuClick}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="d-none d-lg-flex align-items-center">

        <a className="invite pr-3">
          Home
          </a>

          <a className="invite">
          About
          </a>
         
          {/* <Dropdown className="mr-3">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              
            </Dropdown.Toggle>

            <div className="mega-menu">
              <Dropdown.Menu>
                <MegaMenu></MegaMenu>
              </Dropdown.Menu>
            </div>
          </Dropdown>

          <div className="search-barx">
            <input
              type="text"
              placeholder="Search"
              onFocus={handleSearchBoxOpen}
            />
            <i className="search-icon text-muted i-Magnifi-Glass1"></i>

            About
          </div>
         */}
        </div>

        <div style={{ margin: "auto" }}></div>

        <div className="header-part-right">
          {/* <i
            className="i-Full-Screen header-icon d-none d-sm-inline-block"
            data-fullscreen
            onClick={toggleFullScreen}
          ></i> */}

          <a href="#" className="invite pr-5">
            Invite a friend
          </a>

          {/* <Dropdown>
            <Dropdown.Toggle as="span" className="toggle-hidden">
              <i
                className="i-Safe-Box text-muted header-icon"
                role="button"
              ></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div className="menu-icon-grid">
                {shorcutMenuList.map(menu => (
                  <Link key={menu.text} to={menu.link}>
                    <i className={menu.icon}></i> {menu.text}
                  </Link>
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown> */}



          <Dropdown>
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              <div
                className="badge-top-container"
                role="button"
                id="dropdownNotification"
                data-toggle="dropdown"
              >
                              <button className="secondary-btn-small">Login | Signup</button>

              </div>
            </Dropdown.Toggle>

         
            <DropdownMenu>
                {/* <div className="dropdown-header">
                  <i className="i-Lock-User mr-1"></i> 
                </div> */}
                <Link to="#" onClick={toggleSignIn} className="dropdown-item cursor-pointer">
                <i className="i-Lock-User mr-1"></i>   Login
                </Link>

                <Dropdown.Divider/>
                <Link to="#" onClick={toggleSignUp} className="dropdown-item cursor-pointer">
                <i className="i-Add-UserStar mr-1"></i>  Signup
                </Link>
                {/* <Link
                  to="/"
                  className="dropdown-item cursor-pointer"
                  onClick={props.logoutUser}
                >
                  Sign out
                </Link> */}
              </DropdownMenu>
         
         
          </Dropdown>

          
          <div className="user col align-self-end">
          
            {/* <Dropdown>
              <DropdownToggle
                as="span"
                className="toggle-hidden cursor-pointer"
              >
               <button className="secondary-btn-small">Login | Signup</button>
              </DropdownToggle>
           
              <DropdownMenu>
                <div className="dropdown-header">
                  <i className="i-Lock-User mr-1"></i> Timothy Carlson
                </div>
                <Link to="/" className="dropdown-item cursor-pointer">
                  Account settings
                </Link>
                <Link to="/" className="dropdown-item cursor-pointer">
                  Billing history
                </Link>
                <Link
                  to="/"
                  className="dropdown-item cursor-pointer"
                  onClick={props.logoutUser}
                >
                  Sign out
                </Link>
              </DropdownMenu>
         
            </Dropdown>
           */}

           <button className="white-outline primary-btn-small dropdown-header">
             Become a Seller
           </button>
          
          </div>
        </div>
      </div>
    

        </>

        
    

      )
    

}

export default NewLayoutHeader;
