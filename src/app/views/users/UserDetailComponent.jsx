import React, { Component, useState, useEffect } from "react"
import { Dropdown, Row, Col, Badge,Button,Form, ButtonToolbar,Modal, Tab, Tabs, TabContent, Nav } from "react-bootstrap";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import {FetchingRecords} from "../../appWidgets";
import { Link, Redirect } from "react-router-dom";
import { Breadcrumb } from "@gull";

// import queryString from 'query-string';


  
import LaddaButton, {
    XL,
    EXPAND_LEFT,
    EXPAND_RIGHT,
    EXPAND_UP,

    CONTRACT,
  } from "react-ladda";
import { toLength } from "lodash";

export class UserDetailComponent extends Component{

    state = {

        userSlug:"",
        viewedUser:{},
        allChecked:false,
        navigate: false,
        newRoute:"",
        editedIndex:0,
        allUsers:[],
        allTasks:[],
        isSaving:false,
        isFetching:true,
        updateMsg:'Save',
        userMembers: [
            {
              name: "Smith Doe",
              email: "Smith@gmail.com",
              status: "active",
              photoUrl: "/assets/images/faces/1.jpg"
            },
            {
              name: "Jhon Doe",
              email: "Jhon@gmail.com",
              status: "pending",
              photoUrl: "/assets/images/faces/2.jpg"
            },
            {
              name: "Alex",
              email: "Otttio@gmail.com",
              status: "inactive",
              photoUrl: "/assets/images/faces/3.jpg"
            },
            {
              name: "Mathew Doe",
              email: "matheo@gmail.com",
              status: "active",
              photoUrl: "/assets/images/faces/4.jpg"
            }
          ]
        
    

    }
    appMainService;

    
    
    constructor(props){
        super(props)
        this.appMainService = new AppMainService();
    }

    componentDidMount(){
        // let params = queryString.parse(this.props.location.search);
        const params = this.props.match.params;
        const userSlug = params.slug;
        console.log('Params', params)
         this.getUserBySlug(userSlug);
    }

 customTabHeader = (title, icon) => (
        <div className="d-flex align-items-center">
          <span className="mr-2">
            <i className={icon}></i>
          </span>
          <span>{title}</span>
        </div>
      );


    /**
     * 
     * @param {*} task 
     * This method saves the permissions for a user
     */
    addPermission = (task) =>{
        let {viewedUser,allChecked} = this.state;
        const tasks = viewedUser['tasks'];
        const findTask = tasks.findIndex(t => t._id == task._id);
        if(findTask != -1){
            tasks.splice(findTask, 1) // remove
        }else{
            tasks.push(task) // add
            console.log('Tasks ', tasks)
        }
        allChecked = tasks?.length == this.state.allTasks.length && tasks.length 
        viewedUser['tasks'] = tasks;
        this.setState({viewedUser, allChecked})
    }



    /**
     * This method lists all users
     */
     getAllUsers = async ()=>{
         let isFetching = false;

        this.appMainService.getAllUsers().then(
            (usersResponse)=>{
                const allUsers = usersResponse;
                this.setState({ allUsers, isFetching })
                console.log('Users response', usersResponse)
            }
        ).catch((error)=>{
            this.setState({isFetching})
            const errorNotification = {
                type:'error',
                msg:utils.processErrors(error)
            }
            new AppNotification(errorNotification)
            console.log('Error', error)
        })
    }


    /**
     * This method gets a user by its slug
     */
    getUserBySlug = async (slug)=>{
        let isFetching = false;
       this.appMainService.getUserBySlug(slug).then(
           (viewedUser)=>{
               this.setState({ viewedUser, isFetching })
               console.log('Users viewed', viewedUser)
           }
       ).catch((error)=>{
           this.setState({isFetching})
           const errorNotification = {
               type:'error',
               msg:utils.processErrors(error)
           }
           new AppNotification(errorNotification)
           console.log('Error', error)
       })
   }


    /**
     * This method lists all tasks
     */
    getAllTasks = async (round2 = false)=>{
        let isFetching = false;

       this.appMainService.getAllTasks().then(
           (tasksResponse)=>{
               const allTasks = tasksResponse;
               if(!allTasks.length && !round2){
                  return this.getAllTasks(true);
                   
               }
               const allChecked = this.state?.viewedUser?.tasks?.length == allTasks.length && allTasks.length ;
               
               this.setState({ allTasks, isFetching, allChecked })
               console.log('Tasks response', tasksResponse)
           }
       ).catch((error)=>{
           this.setState({isFetching})
           const errorNotification = {
               type:'error',
               msg:utils.processErrors(error)
           }
           new AppNotification(errorNotification)
           console.log('Error', error)
       })
   }

   formatTaskName = (taskName)=> {
    taskName = taskName.replace('.', ' | ').split('_').join(' ');
    return utils.toTiltle(taskName);
  }

  includesTask = (task) =>{
      return this.state.viewedUser.tasks.filter( t=> t._id == task._id ).length > 0
  }

  checkorUncheckAll = () => {
    let {allTasks, viewedUser, allChecked} = this.state;
    let {tasks} = viewedUser;

    if(!allChecked){
        allTasks.forEach(t =>{
            if(!this.includesTask(t)){
                tasks.push(t)
            }   
        })
    }else{
        tasks = [];
    }
    allChecked = !allChecked;
    viewedUser['tasks'] = tasks;
    this.setState({viewedUser, allChecked});

  }
    

    /**
     * This method updates a new user
     */
    savePermissions = async ()=>{
        let isSaving = true;
        let updateMsg = 'Saving';
        this.setState({isSaving, updateMsg})
        this.appMainService.updateUser(this.state.viewedUser, this.state.viewedUser._id).then(
            (viewedUser)=>{
                isSaving = false;
                updateMsg = 'Save';
                this.setState({ viewedUser, isSaving, updateMsg })
                const successNotification = {
                    type:'success',
                    msg:`Successfully updated ${viewedUser.name} permissions!`
                }
                new AppNotification(successNotification)
               
            }
        ).catch(
            (error)=>{
                isSaving = false;
                updateMsg = 'Save';
                this.setState({ isSaving, updateMsg })
                const errorNotification = {
                    type:'error',
                    msg:utils.processErrors(error)
                }
                new AppNotification(errorNotification)
        })
    }


  



    /**
     * 
     * @param {*} user
     * This method toggles a user's status 
     */
    toggleUser = (user)=>{
        const toggleMsg = user.status? "Disable":"Enable";
        const gL = user.status? "lose":"gain"
       

        swal.fire({
            title: `<small>${toggleMsg}&nbsp;<b>${user.name}</b>?</small>`,
            text: `${user.name} members will ${gL} permissions.`,
            icon: "warning",
            type: "question",
            showCancelButton: true,
            confirmButtonColor: "#007BFF",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
            cancelButtonText: "No"
          })
          .then(result => {
            if (result.value) {
                let { allUsers } = this.state
                const toggleIndex = allUsers.findIndex(r => r._id == user._id)
                // user.status = !user.status;

              this.appMainService.toggleUser(user).then(
                (toggledUser)=>{
                    allUsers.splice(toggleIndex, 1, toggledUser)
                    this.setState({ allUsers })
                    const successNotification = {
                        type:'success',
                        msg:`${toggledUser.name} successfully ${toggleMsg}d!`
                    }
                    new AppNotification(successNotification)
                }
            ).catch(
                (error)=>{
                    const errorNotification = {
                        type:'error',
                        msg:utils.processErrors(error)
                    }
                    new AppNotification(errorNotification)
            })}
          
          });
    }

    /**
     * 
     * @param {*} user 
     * This method deletes a user
     * 
     */
    deleteUser = (user)=>{
         swal.fire({
                title: `<small>Delete&nbsp;<b>${user.name}</b>?</small>`,
                text: "You won't be able to revert this!",
                icon: "warning",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#007BFF",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
                cancelButtonText: "No"
              })
              .then(result => {
                if (result.value) {
                let { allUsers } = this.state
                  this.appMainService.deleteUser(user).then(
                    (deletedUser)=>{
                        allUsers = allUsers.filter(r=> r._id !== user._id)
                        this.setState({ allUsers })
                        const successNotification = {
                            type:'success',
                            msg:`${user.name} successfully deleted!`
                        }
                        new AppNotification(successNotification)
                    }
                ).catch(
                    (error)=>{
                        const errorNotification = {
                            type:'error',
                            msg:utils.processErrors(error)
                        }
                        new AppNotification(errorNotification)
                })}
              
              });
     }

      /**
     * 
     * @param {*} modalName 
     */
    resetForm = ()=> {
        const createUserForm = {
            name: "",
            description: "",
          }
          this.setState({createUserForm})

    }
    getUserStatusClass = status => {
        switch (status) {
          case "active":
            return "badge-success";
          case "inactive":
            return "badge-warning";
          case "pending":
            return "badge-primary";
          default:
            break;
        }
      };
    

      render() {
        return (
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Home", path: "/" },
                { name: "Pages", path: "/pages" },
                { name: "User Profile" }
              ]}
            ></Breadcrumb>
    
            <div className="card user-profile o-hidden mb-4">
              <div
                className="header-cover"
                style={{
                  backgroundImage: "url('/assets/images/photo-wide-5.jpeg')"
                }}
              ></div>
              <div className="user-info">
                <img
                  className="profile-picture avatar-lg mb-2"
                  src="/assets/images/faces/1.jpg"
                  alt=""
                />
                <p className="m-0 text-24">{this.state.viewedUser?.full_name || this.state.viewedUser?.username}</p>
                <p className="text-muted m-0">{this.state.viewedUser?.user_type}</p>
              </div>
              <div className="card-body pt-4">
                <Tabs
                  defaultActiveKey="Timeline"
                  className="justify-content-center profile-nav mb-4"
                >
                  <Tab eventKey="Timeline" title="Timeline">
                    <div
                      className="tab-pane fade active show"
                      id="timeline"
                      role="tabpanel"
                      aria-labelledby="timeline-tab"
                    >
                      <ul className="timeline clearfix">
                        <li className="timeline-line"></li>
                        <li className="timeline-item">
                          <div className="timeline-badge">
                            <i className="badge-icon bg-primary text-white i-Cloud-Laptop"></i>
                          </div>
                          <div className="timeline-card card">
                            <div className="card-body">
                              <div className="mb-1">
                                <strong className="mr-1">Timothy Carlson</strong>
                                added a new photo
                                <p className="text-muted">3 hours ago</p>
                              </div>
                              <img
                                className="rounded mb-2"
                                src="/assets/images/photo-wide-1.jpg"
                                alt=""
                              />
                              <div className="mb-3">
                                <span className="mr-1">Like</span>
                                <span>Comment</span>
                              </div>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Write comment"
                                  aria-label="comment"
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-comment1"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="timeline-item">
                          <div className="timeline-badge">
                            <img
                              className="badge-img"
                              src="/assets/images/faces/1.jpg"
                              alt=""
                            />
                          </div>
                          <div className="timeline-card card">
                            <div className="card-body">
                              <div className="mb-1">
                                <strong className="mr-1">Timothy Carlson</strong>
                                updated his sattus
                                <p className="text-muted">16 hours ago</p>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing
                                elit. Modi dicta beatae illo illum iusto iste
                                mollitia explicabo quam officia. Quas ullam,
                                quisquam architecto aspernatur enim iure debitis
                                dignissimos suscipit ipsa.
                              </p>
                              <div className="mb-3">
                                <span className="mr-1">Like</span>
                                <span>Comment</span>
                              </div>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Write comment"
                                  aria-label="comment"
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-comment2"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="timeline clearfix">
                        <li className="timeline-line"></li>
                        <li className="timeline-group text-center">
                          <button className="btn btn-icon-text btn-primary">
                            <i className="i-Calendar-4"></i> 2018
                          </button>
                        </li>
                      </ul>
                      <ul className="timeline clearfix">
                        <li className="timeline-line"></li>
                        <li className="timeline-item">
                          <div className="timeline-badge">
                            <i className="badge-icon bg-danger text-white i-Love-User"></i>
                          </div>
                          <div className="timeline-card card">
                            <div className="card-body">
                              <div className="mb-1">
                                <strong className="mr-1">New followers</strong>
                                <p className="text-muted">2 days ago</p>
                              </div>
                              <p>
                                <Link to="/">Henry krick</Link> and 16 others
                                followed you
                              </p>
                              <div className="mb-3">
                                <span className="mr-1">Like</span>
                                <span>Comment</span>
                              </div>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Write comment"
                                  aria-label="comment"
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-comment3"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="timeline-item">
                          <div className="timeline-badge">
                            <i className="badge-icon bg-primary text-white i-Cloud-Laptop"></i>
                          </div>
                          <div className="timeline-card card">
                            <div className="card-body">
                              <div className="mb-1">
                                <strong className="mr-1">Timothy Carlson</strong>
                                added a new photo
                                <p className="text-muted">2 days ago</p>
                              </div>
                              <img
                                className="rounded mb-2"
                                src="/assets/images/photo-wide-2.jpg"
                                alt=""
                              />
                              <div className="mb-3">
                                <span className="mr-1">Like</span>
                                <span>Comment</span>
                              </div>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Write comment"
                                  aria-label="comment"
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-comment4"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="timeline clearfix">
                        <li className="timeline-line"></li>
                        <li className="timeline-group text-center">
                          <button className="btn btn-icon-text btn-warning">
                            <i className="i-Calendar-4"></i> Joined in 2013
                          </button>
                        </li>
                      </ul>
                    </div>
                  </Tab>
                  <Tab eventKey="About" title="About">
                    <h4>Personal Information</h4>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eveniet, commodi quam! Provident quis voluptate asperiores
                      ullam, quidem odio pariatur. Lorem ipsum, dolor sit amet
                      consectetur adipisicing elit. Voluptatem, nulla eos? Cum non
                      ex voluptate corporis id asperiores doloribus dignissimos
                      blanditiis iusto qui repellendus deleniti aliquam, vel quae
                      eligendi explicabo.
                    </p>
                    <hr />
                    <div className="row">
                      <div className="col-md-4 col-6">
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Calendar text-16 mr-1"></i> Birth Date
                          </p>
                          <span>1 Jan, 1994</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Edit-Map text-16 mr-1"></i> Birth Place
                          </p>
                          <span>Dhaka, DB</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Globe text-16 mr-1"></i> Lives In
                          </p>
                          <span>Dhaka, DB</span>
                        </div>
                      </div>
                      <div className="col-md-4 col-6">
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-MaleFemale text-16 mr-1"></i> Gender
                          </p>
                          <span>1 Jan, 1994</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-MaleFemale text-16 mr-1"></i> Email
                          </p>
                          <span>example@ui-lib.com</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Cloud-Weather text-16 mr-1"></i>
                            Website
                          </p>
                          <span>www.ui-lib.com</span>
                        </div>
                      </div>
                      <div className="col-md-4 col-6">
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Business-Man text-16 mr-1"></i>
                            Profession
                          </p>
                          <span>Digital Marketer</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Conference text-16 mr-1"></i>
                            Experience
                          </p>
                          <span>8 Years</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-primary mb-1">
                            <i className="i-Home1 text-16 mr-1"></i> School
                          </p>
                          <span>School of Digital Marketing</span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h4>Other Info</h4>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                      dolore labore reiciendis ab quo ducimus reprehenderit natus
                      debitis, provident ad iure sed aut animi dolor incidunt
                      voluptatem. Blanditiis, nobis aut.
                    </p>
                    <div className="row">
                      <div className="col-md-2 col-sm-4 col-6 text-center">
                        <i className="i-Plane text-32 text-primary"></i>
                        <p className="text-16 mt-1">Travelling</p>
                      </div>
                      <div className="col-md-2 col-sm-4 col-6 text-center">
                        <i className="i-Camera text-32 text-primary"></i>
                        <p className="text-16 mt-1">Photography</p>
                      </div>
                      <div className="col-md-2 col-sm-4 col-6 text-center">
                        <i className="i-Car-2 text-32 text-primary"></i>
                        <p className="text-16 mt-1">Driving</p>
                      </div>
                      <div className="col-md-2 col-sm-4 col-6 text-center">
                        <i className="i-Atom text-32 text-primary"></i>
                        <p className="text-16 mt-1">Gaming</p>
                      </div>
                      <div className="col-md-2 col-sm-4 col-6 text-center">
                        <i className="i-Music-Note-2 text-32 text-primary"></i>
                        <p className="text-16 mt-1">Music</p>
                      </div>
                      <div className="col-md-2 col-sm-4 col-6 text-center">
                        <i className="i-Shopping-Bag text-32 text-primary"></i>
                        <p className="text-16 mt-1">Shopping</p>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="Friends" title="Friends">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="card card-profile-1 mb-4">
                          <div className="card-body text-center">
                            <div className="avatar box-shadow-2 mb-3">
                              <img src="/assets/images/faces/16.jpg" alt="" />
                            </div>
                            <h5 className="m-0">Jassica Hike</h5>
                            <p className="mt-0">UI/UX Designer</p>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Recusandae cumque.
                            </p>
                            <button className="btn btn-primary btn-rounded">
                              Contact Jassica
                            </button>
                            <div className="card-socials-simple mt-4">
                              <span className="cursor-pointer px-1">
                                <i className="i-Linkedin-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Facebook-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Twitter"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="col-md-3">
                        <div className="card card-profile-1 mb-4">
                          <div className="card-body text-center">
                            <div className="avatar box-shadow-2 mb-3">
                              <img src="/assets/images/faces/2.jpg" alt="" />
                            </div>
                            <h5 className="m-0">Frank Powell</h5>
                            <p className="mt-0">UI/UX Designer</p>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Recusandae cumque.
                            </p>
                            <button className="btn btn-primary btn-rounded">
                              Contact Frank
                            </button>
                            <div className="card-socials-simple mt-4">
                              <span className="cursor-pointer px-1">
                                <i className="i-Linkedin-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Facebook-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Twitter"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="col-md-3">
                        <div className="card card-profile-1 mb-4">
                          <div className="card-body text-center">
                            <div className="avatar box-shadow-2 mb-3">
                              <img src="/assets/images/faces/3.jpg" alt="" />
                            </div>
                            <h5 className="m-0">Arthur Mendoza</h5>
                            <p className="mt-0">UI/UX Designer</p>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Recusandae cumque.
                            </p>
                            <button className="btn btn-primary btn-rounded">
                              Contact Arthur
                            </button>
                            <div className="card-socials-simple mt-4">
                              <span className="cursor-pointer px-1">
                                <i className="i-Linkedin-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Facebook-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Twitter"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="col-md-3">
                        <div className="card card-profile-1 mb-4">
                          <div className="card-body text-center">
                            <div className="avatar box-shadow-2 mb-3">
                              <img src="/assets/images/faces/4.jpg" alt="" />
                            </div>
                            <h5 className="m-0">Jacqueline Day</h5>
                            <p className="mt-0">UI/UX Designer</p>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Recusandae cumque.
                            </p>
                            <button className="btn btn-primary btn-rounded">
                              Contact Jacqueline
                            </button>
                            <div className="card-socials-simple mt-4">
                              <span className="cursor-pointer px-1">
                                <i className="i-Linkedin-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Facebook-2"></i>
                              </span>
                              <span className="cursor-pointer px-1">
                                <i className="i-Twitter"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="Photos" title="Photos">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card text-white o-hidden mb-3">
                          <img
                            className="card-img"
                            src="/assets/images/products/headphone-1.jpg"
                            alt=""
                          />
                          <div className="card-img-overlay">
                            <div className="p-1 text-left card-footer font-weight-light d-flex">
                              <span className="mr-3 d-flex align-items-center">
                                <i className="i-Speach-Bubble-6 mr-1"></i>
                                12
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="i-Calendar-4 mr-2"></i>03.12.2018
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="col-md-4">
                        <div className="card text-white o-hidden mb-3">
                          <img
                            className="card-img"
                            src="/assets/images/products/headphone-2.jpg"
                            alt=""
                          />
                          <div className="card-img-overlay">
                            <div className="p-1 text-left card-footer font-weight-light d-flex">
                              <span className="mr-3 d-flex align-items-center">
                                <i className="i-Speach-Bubble-6 mr-1"></i>
                                12
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="i-Calendar-4 mr-2"></i>03.12.2018
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="col-md-4">
                        <div className="card text-white o-hidden mb-3">
                          <img
                            className="card-img"
                            src="/assets/images/products/headphone-3.jpg"
                            alt=""
                          />
                          <div className="card-img-overlay">
                            <div className="p-1 text-left card-footer font-weight-light d-flex">
                              <span className="mr-3 d-flex align-items-center">
                                <i className="i-Speach-Bubble-6 mr-1"></i>
                                12
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="i-Calendar-4 mr-2"></i>03.12.2018
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card text-white o-hidden mb-3">
                          <img
                            className="card-img"
                            src="/assets/images/products/iphone-1.jpg"
                            alt=""
                          />
                          <div className="card-img-overlay">
                            <div className="p-1 text-left card-footer font-weight-light d-flex">
                              <span className="mr-3 d-flex align-items-center">
                                <i className="i-Speach-Bubble-6 mr-1"></i>
                                12
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="i-Calendar-4 mr-2"></i>03.12.2018
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card text-white o-hidden mb-3">
                          <img
                            className="card-img"
                            src="/assets/images/products/iphone-2.jpg"
                            alt=""
                          />
                          <div className="card-img-overlay">
                            <div className="p-1 text-left card-footer font-weight-light d-flex">
                              <span className="mr-3 d-flex align-items-center">
                                <i className="i-Speach-Bubble-6 mr-1"></i>
                                12
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="i-Calendar-4 mr-2"></i>03.12.2018
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card text-white o-hidden mb-3">
                          <img
                            className="card-img"
                            src="/assets/images/products/watch-1.jpg"
                            alt=""
                          />
                          <div className="card-img-overlay">
                            <div className="p-1 text-left card-footer font-weight-light d-flex">
                              <span className="mr-3 d-flex align-items-center">
                                <i className="i-Speach-Bubble-6 mr-1"></i>
                                12
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="i-Calendar-4 mr-2"></i>03.12.2018
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        );
      }

}




export default UserDetailComponent;


