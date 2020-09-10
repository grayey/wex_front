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
import { toLength } from "lodash";

export class RoleDetailComponent extends Component{

    state = {

        roleSlug:"",
        viewedRole:{},
        allChecked:false,
        navigate: false,
        newRoute:"",
        editedIndex:0,
        allRoles:[],
        allTasks:[],
        isSaving:false,
        isFetching:true,
        updateMsg:'Save',
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
     * This method saves the permissions for a role
     */
    addPermission = (task) =>{
        let {viewedRole,allChecked} = this.state;
        const tasks = viewedRole['tasks'];
        const findTask = tasks.findIndex(t => t._id == task._id);
        if(findTask != -1){
            tasks.splice(findTask, 1) // remove
        }else{
            tasks.push(task) // add
            console.log('Tasks ', tasks)
        }
        allChecked = tasks?.length == this.state.allTasks.length && tasks.length 
        viewedRole['tasks'] = tasks;
        this.setState({viewedRole, allChecked})
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
               const allChecked = this.state?.viewedRole?.tasks?.length == allTasks.length && allTasks.length ;
               
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
      return this.state?.viewedRole?.tasks?.filter( t=> t._id == task._id ).length > 0
  }

  checkorUncheckAll = () => {
    let {allTasks, viewedRole, allChecked} = this.state;
    let {tasks} = viewedRole;

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
    viewedRole['tasks'] = tasks;
    this.setState({viewedRole, allChecked});

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


                            <Tabs defaultActiveKey="role_information" id="uncontrolled-tab-example">
                                            <Tab
                                                eventKey="role_information"
                                                title={this.customTabHeader("Role information", "i-Atom")}
                                            >
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
                                                        <li className="list-group-item"><b>No. of members: </b>{this.state.viewedRole?.users?.length}</li>
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
                                                        <div style={{"maxHeight":"270px", "overflowY":"scroll"}}>
                                                <table id="user_table" className="table  text-center">
                                                    <thead>
                                                    <tr className="ul-widget6__tr--sticky-th">
                                                    <th>#</th>
                                                    <th>Full Name</th>
                                                    
                                                    <th>Email</th>
                                                    <th>Phone No.</th>
                                                    
                                                    <th>Status</th>
                                                    <th>Date Created</th>
                                                    
                                                
                                                    </tr>
                                                    </thead>
                                                <tbody>
                                                {
                                          this.state?.viewedRole?.users?.length ?  this.state?.viewedRole?.users?.map( (user, index)=>{
                                                return (
                                                    <tr key={user._id} className={user.temp_flash ? 'bg-success text-white':''}>
                                                        <td>
                                                            <b>{index+1}</b>.
                                                        </td>
                                                        <td>
                                                            <Link  key={user._id} to={`/dashboard/users/${user._id}}`} onClick={
                                                                (event)=>{
                                                                    this.viewUser(event, user)
                                                                }
                                                            }>
                                                            {user.full_name}
                                                            </Link>
                                                           
                                                        </td>
                                                      
                                                        <td>
                                                        {user.email}
                                                        </td>
                                                        <td>
                                                        {user.phone_no}
                                                        </td>
                                                       
                                                        <td>
                                                        
                                                        <span className={user.status ? 'text-success' : 'text-danger'}>
                                                            {user.status ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </td>

                                                        <td>
                                                        {utils.formatDate(user.created_at)}
                                                        </td>
                                                      
                                                        
                                                    
                                                    </tr>
                                                ) 
                                                
                                              
                                            }) :
                                            (
                                                <tr>
                                                    <td className='text-center' colSpan='11'>
                                                    <FetchingRecords isFetching={this.state.isFetching}/>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                                </tbody>
                                                </table>
                                                </div>

                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>



                                                </div>

                                            </Tab>
                                            <Tab
                                                eventKey="permissions"
                                                title={this.customTabHeader("Configure permissions", "i-Gear-2")}
                                            >
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
                                                                            <div> 
                                                                            {/*  style={{"maxHeight":"500px", "overflowY":"scroll"}} */}
                                                                            
                                                                                     <table className="display table table-striped table-hover " id="zero_configuration_table" style={{"width":"100%"}}>
                                                                    <thead>
                                                                        <tr className="ul-widget6__tr--sticky-th">
                                                                            <th>#</th>
                                                                            <th>Name</th>
                                                                            <th>Module</th>
                                                                            <th>Date Created</th>
                                                                            <th>Date Updated</th>                                              
                                                                            <th>
                                                                                <div className="form-inline" style={{cursor:"pointer !important"}}>
                                                                                Select &nbsp; <b>|</b> &nbsp; <Form.Check
                                                                                                    name="check_uncheck"
                                                                                                    
                                                                                                    onChange={this.checkorUncheckAll}
                                                                                                    value=""
                                                                                                    checked={this.state.allChecked}
                                                                                                    type="checkbox"
                                                                                                    id="check_uncheck"
                                                                                                    className={`text-${this.state.allChecked ? 'danger':'success'}`}
                                                                                                    label={this.state.allChecked ?'uncheck all':'check all'}
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
                                                                                        {this.formatTaskName(task?.name)} &nbsp;

                                                                                        {
                                                                                            this.includesTask(task) ? (
                                                                                                <Badge  pill variant="success" className="m-1">
                                                                                                    assigned
                                                                                                </Badge>
                                                                                            ): null
                                                                                        }

                                                                                        
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
                                                                                                    name="checkbox3"
                                                                                                    key={`check2${task._id}`}
                                                                                                    onChange={()=>{
                                                                                                    this.addPermission(task)
                                                                                                    }}
                                                                                                    value=""
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
                                                                        </div>


                                            </Tab>
                                            
                            </Tabs>

                               
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


}




export default RoleDetailComponent;


