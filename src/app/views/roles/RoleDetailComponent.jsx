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
// import queryString from 'query-string';


  
import LaddaButton, {
    XL,
    EXPAND_LEFT,
    EXPAND_RIGHT,
    EXPAND_UP,

    CONTRACT,
  } from "react-ladda";

export class RoleDetailComponent extends Component{

    state = {

        roleSlug:"",
        viewedRole:{},
        navigate: false,
        newRoute:"",
        editedIndex:0,
        allRoles:[],
        allTasks:[],
        showEditModal:false,
        showCreateModal:false,
        isSaving:false,
        isFetching:true,
        saveMsg:'Save',
        updateMsg:'Save',
        editedRole: {},
        createRoleForm: {
            name: "",
            description: "",
          },
          updateRoleForm: {
            name: "",
            description: "",
          },

          roleMembers: [
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
        const roleSlug = params.slug;
        console.log('Params', params)
         this.getRoleBySlug(roleSlug);
         this.getAllTasks();
    }

    /**
     * 
     * @param {*} event 
     * @param {*} errors 
     * @param {*} form 
     */

    handleChange = (event, form='create') => {
        const {createRoleForm, updateRoleForm} = this.state
        if(form=='create'){
            createRoleForm[event.target.name] = event.target.value;
        }else if(form=='edit'){
            updateRoleForm[event.target.name] = event.target.value;
        }
        this.setState({ createRoleForm, updateRoleForm });
    }

    /**
     * 
     * @param {*} task 
     * This method saves the permissions for a role
     */
    addPermission = (task) =>{
        const {viewedRole} = this.state;
        const tasks = viewedRole['tasks'];
        const findTask = tasks.findIndex(t => t._id == task._id);
        if(findTask > 0){
            tasks.splice(findTask, 1) // remove
        }else{
            tasks.push(task) // add
            console.log('Tasks ', tasks)
        }
        viewedRole['tasks'] = tasks;
        console.log("Viewed Role:: ",viewedRole);

        this.setState({viewedRole})


    }



    /**
     * This method lists all roles
     */
     getAllRoles = async ()=>{
         let isFetching = false;

        this.appMainService.getAllRoles().then(
            (rolesResponse)=>{
                const allRoles = rolesResponse;
                this.setState({ allRoles, isFetching })
                console.log('Roles response', rolesResponse)
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
     * This method gets a role by its slug
     */
    getRoleBySlug = async (slug)=>{
        let isFetching = false;
       this.appMainService.getRoleBySlug(slug).then(
           (viewedRole)=>{
               this.setState({ viewedRole, isFetching })
               console.log('Roles viewed', viewedRole)
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
               this.setState({ allTasks, isFetching })
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
      return this.state.viewedRole.tasks.filter( t=> t._id == task._id ).length > 0
  }
    /**
     * This method creates a new role
     */
    createRole = async ()=>{
        const {createRoleForm, allRoles} = this.state; 
        let isSaving = true;
        let saveMsg = 'Saving';
        this.setState({isSaving, saveMsg})
        this.appMainService.createRole(createRoleForm).then(
            (roleData)=>{
                isSaving = false;
                saveMsg = 'Save';
                allRoles.unshift(roleData)
                this.setState({ allRoles, isSaving, saveMsg })
                const successNotification = {
                    type:'success',
                    msg:`${roleData.name} successfully created!`
                }
                new AppNotification(successNotification)
                this.toggleModal();
                this.resetForm();
                
            }
        ).catch(
            (error)=>{
                isSaving = false;
                saveMsg = 'Save';
                this.setState({ isSaving, saveMsg })
                const errorNotification = {
                    type:'error',
                    msg:utils.processErrors(error)
                }
                new AppNotification(errorNotification)
        })
    }


    /**
     * This method updates a new role
     */
    savePermissions = async ()=>{
        let isSaving = true;
        let updateMsg = 'Saving';
        this.setState({isSaving, updateMsg})
        this.appMainService.updateRole(this.state.viewedRole, this.state.viewedRole._id).then(
            (viewedRole)=>{
                isSaving = false;
                updateMsg = 'Save';
                this.setState({ viewedRole, isSaving, updateMsg })
                const successNotification = {
                    type:'success',
                    msg:`Successfully updated ${viewedRole.name} permissions!`
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
     * @param {*} modalName 
     * This method toggles a modal
     */
    toggleModal = (modalName='create')=> {
        let {showEditModal, showCreateModal } = this.state;
        if(modalName == 'create'){
            showCreateModal = !showCreateModal;
        }else if(modalName == 'edit'){
            showEditModal = !showEditModal
        }
        
        this.setState({ showEditModal, showCreateModal })
    }



    /**
     * 
     * This method sets the role to be edited
     *  and opens the modal for edit
     * 
     */
    editRole = (editedRole) => {
        const updateRoleForm = {...editedRole}
        const editedIndex = this.state.allRoles.findIndex(role => editedRole._id == role._id)
        this.setState({editedRole, editedIndex, updateRoleForm});
        this.toggleModal('edit')
    }

      /**
     * 
     * This method sets the role to be edited
     *  and opens the modal for edit
     * 
     */
    viewRole = (event, role) => {
        event.preventDefault();
        const newRoute = `/dashboard/roles/${role._id}`
        this.setState({ navigate:true, newRoute })
    
    }

   

    /**
     * 
     * @param {*} role
     * This method toggles a role's status 
     */
    toggleRole = (role)=>{
        const toggleMsg = role.status? "Disable":"Enable";
        const gL = role.status? "lose":"gain"
       

        swal.fire({
            title: `<small>${toggleMsg}&nbsp;<b>${role.name}</b>?</small>`,
            text: `${role.name} members will ${gL} permissions.`,
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
                let { allRoles } = this.state
                const toggleIndex = allRoles.findIndex(r => r._id == role._id)
                // role.status = !role.status;

              this.appMainService.toggleRole(role).then(
                (toggledRole)=>{
                    allRoles.splice(toggleIndex, 1, toggledRole)
                    this.setState({ allRoles })
                    const successNotification = {
                        type:'success',
                        msg:`${toggledRole.name} successfully ${toggleMsg}d!`
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
     * @param {*} role 
     * This method deletes a role
     * 
     */
    deleteRole = (role)=>{
         swal.fire({
                title: `<small>Delete&nbsp;<b>${role.name}</b>?</small>`,
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
                let { allRoles } = this.state
                  this.appMainService.deleteRole(role).then(
                    (deletedRole)=>{
                        allRoles = allRoles.filter(r=> r._id !== role._id)
                        this.setState({ allRoles })
                        const successNotification = {
                            type:'success',
                            msg:`${role.name} successfully deleted!`
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
        const createRoleForm = {
            name: "",
            description: "",
          }
          this.setState({createRoleForm})

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
    

    render(){

        const { navigate, newRoute } = this.state;
        if (navigate) {
          return <Redirect to={newRoute} />
        }
        
        return (

            <>
                <div className="specific">
        
               
                <div className='float-right'>
                    {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Role</Button> */}
                </div>
        
                <div className="breadcrumb">
                    <h1>{this.state.viewedRole?.name}</h1>
                    <ul>
                        <li><a href="#">Detail</a></li>
                        <li>View</li>
                    </ul>
                </div>
              
                <div className="separator-breadcrumb border-top"></div>
                <div className="row mb-4">
        
                    <div className="col-md-12 mb-4">
                        <div className="cardx text-left">
                            <div className="card-bodyx">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="general">
                                <Nav variant="pills" className="d-flex  px-2">
                                    <Nav.Item className="mr-2 flex-grow-1 text-center">
                                    <Nav.Link eventKey="general">Role Information</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="mr-2 flex-grow-1 text-center">
                                    <Nav.Link eventKey="permissions">Permissions</Nav.Link>
                                    </Nav.Item>
                            
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="general">

                                        <div className="mt-2">

                                        <div className="row">
                                        <div className="col-md-4 border-right">

                                            <div className="card ">
                                                <div className="card-header">
                                                        <h4 className="card-titlex">
                                                        <Badge className={`badge-round-${this.state.viewedRole?.status ? 'success':'danger'}  m-1`}>
                                                                {
                                                                    this.state.viewedRole?.status ? (<span>&#x2713;</span>):  (<span>&#x21;</span>)
                                                                }
                                                            </Badge>
                                                            General
                                                            </h4>
                                                </div>  
                                                
                                                <div className="card-body">
                                                <p>
                                                {this.state.viewedRole?.description}
                                                </p>
                                                <ul className="list-group list-group-flush">
                                                <li className="list-group-item"><b>Name: </b>{this.state.viewedRole?.name}</li>
                                                <li className="list-group-item"><b>No of members: </b>{'5'}</li>
                                                <li className="list-group-item">
                                                    <b>Status: </b>
                                                    <span className={this.state.viewedRole?.status ? 'text-success':'text-danger'}>
                                                    {this.state.viewedRole?.status ? 'Enabled':'Disabled'}
                                                    </span>
                                                
                                                </li>
                                                <li className="list-group-item"><b>Date Created: </b>{utils.formatDate(this.state.viewedRole?.created_at)}</li>
                                                <li className="list-group-item"><b>Date Updated: </b>{utils.formatDate(this.state.viewedRole?.updated_at)}</li>
                                                </ul>
                                                </div>
                                            
                                            </div>
                                       
                                            
                                            
                                        </div>

                                        <div className="col-md-8">
                                        <div className="card ">
                                                <div className="card-header">
                                                        <h4 className="card-titlex"><b>{this.state.viewedRole?.name}</b> members</h4>
                                                </div>  
                                                
                                                <div className="card-body">
                                                <div className="table-responsive">
                      <table id="user_table" className="table  text-center">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Avatar</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.roleMembers.map((user, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{user.name}</td>
                              <td>
                                <img
                                  className="rounded-circle m-0 avatar-sm-table "
                                  src={user.photoUrl}
                                  alt=""
                                />
                              </td>

                              <td>{user.email}</td>
                              <td>
                                <span
                                  className={`badge ${this.getUserStatusClass(
                                    user.status
                                  )}`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td>
                                <span className="cursor-pointer text-success mr-2">
                                  <i className="nav-icon i-Pen-2 font-weight-bold"></i>
                                </span>
                                <span className="cursor-pointer text-danger mr-2">
                                  <i className="nav-icon i-Close-Window font-weight-bold"></i>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  
                                                </div>
                                            
                                            </div>
                                        </div>
                                    </div>
         


                                        </div>
                                
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="permissions">

                                    <div className="card ">
                                                <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                        
                                                        <h3 className="w-50 float-left card-title m-0"><i className="i-Gears"></i> <b>{this.state.viewedRole?.name}</b> permissions</h3>

                                                        <div className='float-right'>
                                                             {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Role</Button> */}
                                                        
                                                             <LaddaButton
                                                                    className={`btn btn-${true ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
                                                                    loading={this.state.isSaving}
                                                                    progress={0.5}
                                                                    type='button'
                                                                    data-style={EXPAND_RIGHT}
                                                                    onClick = {this.savePermissions}>
                                                                 {this.state.updateMsg} Permissions
                                                            </LaddaButton>
                                                         </div>


                                                </div>  
                                                
                                                <div className="card-body">
                                                <div className="table-responsive">
                                    <table className="display table table-striped table-hover " id="zero_configuration_table" style={{"width":"100%"}}>
                                        <thead>
                                            <tr className="ul-widget6__tr--sticky-th">
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Module</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>                                              
                                                <th>
                                                    <div className="form-inline">
                                                    Select &nbsp; <b>|</b> &nbsp; <Form.Check
                                                                        name="checkbox2"
                                                                        onChange={()=>{
                                                                        alert('Clciked')
                                                                        }}
                                                                        value="check321"
                                                                        checked={true}
                                                                        type="checkbox"
                                                                        id="check2"
                                                                        label="Check all"
                                                                        />
                                                    </div>
                                                    
                                                   
                                                     </th>                                              
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                          this.state.allTasks.length ?  this.state.allTasks.map( (task, index)=>{
                                                return (
                                                    <tr key={task._id} className={task.temp_flash ? 'bg-success text-white':''}>
                                                        <td>
                                                            <b>{index+1}</b>.
                                                        </td>
                                                        <td>
                                                            {this.formatTaskName(task?.name)}
                                                        </td>
                                                        <td>
                                                        {utils.toTiltle(task?.module_name)}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(task.created_at)}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(task.updated_at)}
                                                        </td>

                                                        <td>
                                                        <Form.Check
                                                                        name="checkbox2"
                                                                        onChange={()=>{
                                                                        this.addPermission(task)
                                                                        }}
                                                                        value="check321"
                                                                        checked={this.includesTask(task)}
                                                                        type="checkbox"
                                                                        id={`check2${task._id}`}
                                                                        label=""
                                                                        />
                                                              
                                                        </td>
                                                 
                                                    </tr>
                                                ) 
                                                
                                              
                                            }) :
                                            (
                                                <tr>
                                                    <td className='text-center' colSpan='6'>
                                                    <FetchingRecords isFetching={this.state.isFetching}/>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        
                                        </tbody>
                                     
                                        <tfoot>
                                            <tr>
                                           <td colSpan='7'>

                                           </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                                </div>
                                            
                                            </div>


                                    </Tab.Pane>
                                </Tab.Content>
                                </Tab.Container>
                         
           
                            </div>
                                
                            </div>
                        </div>
                    {/* </div> */}
                    {/* <!-- end of col--> */}


                
                </div>

                </div>
            
            </>
        )


        
    }

createRoleSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required"),
      });


updateRoleSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required"),
        });

}




export default RoleDetailComponent;


