import React, { Component, useState, useEffect } from "react"
import { Dropdown, Row, Col, Button,Form, ButtonToolbar,Modal } from "react-bootstrap";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import {FetchingRecords} from "../../appWidgets";

  
import LaddaButton, {
    XL,
    EXPAND_LEFT,
    EXPAND_RIGHT,
    EXPAND_UP,

    CONTRACT,
  } from "react-ladda";


export class TasksComponent extends Component{

    state = {
        editedIndex:0,
        allTasks:[],
        showEditModal:false,
        showCreateModal:false,
        isSaving:false,
        isFetching:true,
        saveMsg:'Save',
        updateMsg:'Update',
        editedTask: {},
        createTaskForm: {
            name: "",
            description: "",
          },
          updateTaskForm: {
            name: "",
            description: "",
          },

    }
    appMainService;
    

    
    constructor(props){
        super(props)
        this.appMainService = new AppMainService();
    }

    componentDidMount(){
         this.getAllTasks()
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

    render(){
        
        return (

            <>
                <div className="specific">
        
               
                <div className='float-right'>
                    {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Gear-2'></i> Generate System Tasks</Button> */}
                </div>
        
                <div className="breadcrumb">
                    <h1>Tasks</h1>
                    <ul>
                        <li><a href="#">List</a></li>
                        <li>View</li>
                    </ul>
                </div>
              
                <div className="separator-breadcrumb border-top"></div>
                <div className="row mb-4">
        
                    <div className="col-md-12 mb-4">
                        <div className="card text-left">
                            <div className="card-body">
                                <h4 className="card-title mb-3">System Tasks</h4>
                                <p>List of tasks.</p>
                            
                            {/* <div style={{"maxHeight":"500px", "overflowY":"scroll"}}> */}

                            <div className="table-responsive">
                                    <table className="display table table-striped table-hover " id="zero_configuration_table" style={{"width":"100%"}}>
                                        <thead>
                                            <tr className="ul-widget6__tr--sticky-th">
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Module</th>
                                                <th>Type</th>
                                                <th>Url</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>                                              
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
                                                        {task?.method}
                                                        </td>
                                                        <td>
                                                        {task?.path}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(task.created_at)}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(task.updated_at)}
                                                        </td>
                                                 
                                                    </tr>
                                                ) 
                                                
                                              
                                            }) :
                                            (
                                                <tr>
                                                    <td className='text-center' colSpan='7'>
                                                    <FetchingRecords isFetching={this.state.isFetching}/>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        
                                        </tbody>
                                     
                                        <tfoot>
                                            <tr>
                                            <th>#</th>
                                                <th>Name</th>
                                                <th>Module</th>
                                                <th>Type</th>
                                                <th>Url</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>   
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            
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




export default TasksComponent


