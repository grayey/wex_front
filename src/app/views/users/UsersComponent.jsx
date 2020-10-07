import React, { Component, useState, useEffect } from "react"
import { Dropdown, Row, Col, Button,Form, ButtonToolbar,Modal } from "react-bootstrap";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import {FetchingRecords} from "../../appWidgets";
import { Link, Redirect } from "react-router-dom";

  
import LaddaButton, {
    XL,
    EXPAND_LEFT,
    EXPAND_RIGHT,
    EXPAND_UP,

    CONTRACT,
  } from "react-ladda";
import usersRoutes from "./usersRoutes";

export class UsersComponent extends Component{

    state = {
        navigate: false,
        newRoute:"",
        editedIndex:0,
        allUsers:[],
        allRoles:[],
        showRoles:false,
        showEditModal:false,
        showCreateModal:false,
        isSaving:false,
        isFetching:true,
        saveMsg:'Save',
        updateMsg:'Update',
        editedUser: {},
        createUserForm: {
            name: "",
            description: "",
          },
          updateUserForm: {
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
         this.getAllUsers();
         
    }

    /**
     * 
     * @param {*} event 
     * @param {*} errors 
     * @param {*} form 
     */

    handleChange = (event, form='create') => {
        let {createUserForm, updateUserForm, showRoles} = this.state

        if(event.target.name =='user_type'){
            showRoles = event.target.value == 'ADMIN'
        }
         
        if(form=='create'){
            createUserForm[event.target.name] = event.target.value;
        }else if(form=='edit'){
            updateUserForm[event.target.name] = event.target.value;
        }
        this.setState({ createUserForm, updateUserForm, showRoles });
      
    }

    
  /**
     * This method lists all roles
     */
    getAllRoles = async ()=>{
        let {allUsers} = this.state
       this.appMainService.getAllRoles().then(
           (rolesResponse)=>{
               const allRoles = rolesResponse;
               allUsers = allUsers.map((user)=>{
                   user.role = allRoles.filter(r =>{
                    return r._id == user.role_id
                   })[0] || {};
                   return user;
               });
               this.setState({ allRoles, allUsers })
               console.log('Roles response', rolesResponse)
           }
       ).catch((error)=>{
           const errorNotification = {
               type:'error',
               msg:utils.processErrors(error)
           }
           new AppNotification(errorNotification)
           console.log('Error', error)
       })
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
                this.getAllRoles();
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
     * This method creates a new user
     */
    createUser = async ()=>{
        const {createUserForm, allUsers, allRoles} = this.state; 

        if(createUserForm.user_type == 'ADMIN' && !createUserForm.role_id){
            const roleErrorMessage = {
                type:"error",
                msg:"You must set a role for Admin!"
            }
            return new AppNotification(roleErrorMessage);
        }
        if(createUserForm.user_type != 'ADMIN'){
            createUserForm.role_id = null // just making sure
        }

        let isSaving = true;
        let saveMsg = 'Saving';
        this.setState({isSaving, saveMsg})
        createUserForm['tasks'] = [] // create empty tasks array
        this.appMainService.createUser(createUserForm).then(
            (userData)=>{
                isSaving = false;
                saveMsg = 'Save';
                userData = this.patchRole(userData)
                allUsers.unshift(userData)
                this.setState({ allUsers, isSaving, saveMsg })
                const successNotification = {
                    type:'success',
                    msg:`${userData.username} successfully created!`
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
     * This method updates a new user
     */
    updateUser = async ()=>{

        

        let {updateUserForm, allUsers, editedUser} = this.state;
        
           if(updateUserForm.user_type == 'ADMIN' && !updateUserForm.role_id){
                const roleErrorMessage = {
                    type:"error",
                    msg:"You must set a role for Admin!"
                }
            return new AppNotification(roleErrorMessage);
            }
        if(updateUserForm.user_type != 'ADMIN'){
            updateUserForm.role_id = null // just making sure
        }
        let isSaving = true;
        let updateMsg = 'Updating';
        this.setState({isSaving, updateMsg})

        this.appMainService.updateUser(updateUserForm, editedUser._id).then(
            (updatedUser)=>{
                updatedUser.temp_flash = true
                isSaving = false;
                updateMsg = 'Update';
                updatedUser = this.patchRole(updatedUser)
                allUsers.splice(this.state.editedIndex, 1, updatedUser)
                this.setState({ allUsers, isSaving, updateMsg })
                const successNotification = {
                    type:'success',
                    msg:`${updatedUser.username} successfully updated!`
                }
                new AppNotification(successNotification)
                this.toggleModal('edit');

             setTimeout(()=>{
                    updatedUser.temp_flash = false
                    allUsers.splice(this.state.editedIndex, 1, updatedUser)
                    this.setState({ allUsers, isSaving, updateMsg })
                }, 10000);
               
            }
        ).catch(
            (error)=>{
                isSaving = false;
                updateMsg = 'Update';
                this.setState({ isSaving, updateMsg })
                const errorNotification = {
                    type:'error',
                    msg:utils.processErrors(error)
                }
                new AppNotification(errorNotification)
        })
    }

    patchRole = (userData)=>{
        const {allRoles} = this.state
        userData.role =   allRoles.filter(r =>{
            return r._id == userData.role_id
           })[0] || {};

           return userData;
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
     * This method sets the user to be edited
     *  and opens the modal for edit
     * 
     */
    editUser = (editedUser) => {
        const updateUserForm = {...editedUser}
        const showRoles = editedUser.user_type == 'ADMIN'
        const editedIndex = this.state.allUsers.findIndex(user => editedUser._id == user._id)
        this.setState({editedUser, editedIndex, updateUserForm, showRoles});
        this.toggleModal('edit')
    }

    /**
     * This method sets the column class
     */
    setColClass = ()=>  {
        return this.state.showRoles ? "col-md-6 mb-2":"col-md-12 mb-2"
    }    
      /**
     * 
     * This method sets the user to be edited
     *  and opens the modal for edit
     * 
     */
    viewUser = (event, user) => {
        event.preventDefault();
        const newRoute = `/dashboard/users/${user._id}`
        this.setState({ navigate:true, newRoute })
    
    }

   

    /**
     * 
     * @param {*} user
     * This method toggles a user's status 
     */
    toggleUser = (user)=>{
        const toggleMsg = user.status? "Disable":"Enable";
       
       

        swal.fire({
            title: `<small>${toggleMsg}&nbsp;<b>${user.username}</b>?</small>`,
            text: `${user.username}'s profile will be ${toggleMsg}d.`,
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
                    toggledUser = this.patchRole(toggledUser)
                    allUsers.splice(toggleIndex, 1, toggledUser)
                    this.setState({ allUsers })
                    const successNotification = {
                        type:'success',
                        msg:`${toggledUser.username} successfully ${toggleMsg}d!`
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
                title: `<small>Delete&nbsp;<b>${user.username}</b>?</small>`,
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
                            msg:`${user.username} successfully deleted!`
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

    render(){

        const { navigate, newRoute } = this.state;
        if (navigate) {
          return <Redirect to={newRoute} />
        }
        
        return (

            <>
                <div className="specific">
        
                <Modal show={this.state.showEditModal} onHide={
                    ()=>{ this.toggleModal('edit')}
                    } {...this.props} id='edit_modal'>
                    <Modal.Header closeButton>
                    <Modal.Title>Update {this.state.editedUser.username}</Modal.Title>
                    </Modal.Header>
                  
                    <Formik
                    initialValues={this.state.updateUserForm}
                    validationSchema={this.updateUserSchema}
                    onSubmit={this.updateUser}
                    >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm
                    }) => {
                        

                        return (
                            <form
                                className="needs-validation "
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                 <Modal.Body>
                                    <div className="form-row">
                                    <div
                                        className={utils.classList({
                                        "col-md-12 mb-2": true,
                                        "valid-field":
                                            !errors.full_name && touched.full_name,
                                        "invalid-field":
                                            errors.full_name && touched.full_name
                                        })}
                                    >
                                        <label htmlFor="edit_user_name">
                                            <b>Full Name<span className='text-danger'>*</span></b>
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        id="edit_user_name"
                                        placeholder=""
                                        name="full_name"
                                        value={values.full_name}
                                        onChange={(event)=>this.handleChange(event), handleChange}
                                        onBlur={handleBlur}
                                        required
                                        />
                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.full_name}
                                        </div>
                                    </div>
                                  
                                    <div
                                        className={utils.classList({
                                        "col-md-12 mb-2": true,
                                        "valid-field":
                                            !errors.username && touched.username,
                                        "invalid-field":
                                            errors.username && touched.username
                                        })}
                                    >
                                        <label htmlFor="user_name">
                                            <b>Username<span className='text-danger'>*</span></b>
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder=""
                                        name="username"
                                        value={values.username}
                                        onChange={(event)=>this.handleChange(event), handleChange}
                                        onBlur={handleBlur}
                                        required
                                        />
                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.username}
                                        </div>
                                    </div>
                               
                                    <div
                                        className={utils.classList({
                                        "col-md-12 mb-2": true,
                                        "valid-field":
                                            !errors.email && touched.email,
                                        "invalid-field":
                                            errors.email && touched.email
                                        })}
                                    >
                                        <label htmlFor="email">
                                            <b>Email<span className='text-danger'>*</span></b>
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        placeholder=""
                                        name="email"
                                        value={values.email}
                                        onChange={(event)=>this.handleChange(event), handleChange}
                                        onBlur={handleBlur}
                                        required
                                        />
                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.email}
                                        </div>
                                    </div>
                               
                                    <div
                                        className={utils.classList({
                                        "col-md-12 mb-2": true,
                                        "valid-field":
                                            !errors.phone_no && touched.phone_no,
                                        "invalid-field":
                                            errors.phone_no && touched.phone_no
                                        })}
                                    >
                                        <label htmlFor="user_name">
                                            <b>Phone No.</b>
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        id="phone_no"
                                        placeholder=""
                                        name="phone_no"
                                        value={values.phone_no}
                                        onChange={(event)=>this.handleChange(event), handleChange}
                                        onBlur={handleBlur}
                                        required
                                        />
                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.phone_no}
                                        </div>
                                    </div>
                               
                                    <div
                                        className={utils.classList({
                                        [this.setColClass()]: true,
                                        "valid-field":
                                            !errors.user_type && touched.user_type,
                                        "invalid-field":
                                            errors.user_type && touched.user_type
                                        })}
                                    >
                                        <label htmlFor="user_type">
                                            <b>User Type<span className='text-danger'>*</span></b>
                                        </label>
                                        <select className="form-control" id="user_type"
                                         onChange={(event)=>this.handleChange(event), handleChange}
                                         value={values.user_type}
                                         onBlur={handleBlur}
                                         name="user_type"
                                         required
                                        >
                                            <option value="">Select User Type</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="BUYER">Buyer</option>
                                            <option value="SELLER">Seller</option>
    
                                        </select>
    
                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.user_type}
                                        </div>
                                    </div>
    
                                   {
                                        this.state.showRoles ? (
                                            <div
                                        className={utils.classList({
                                        "col-md-6 mb-2": true,
                                        "valid-field":
                                            !errors.role_id && touched.role_id,
                                        "invalid-field":
                                            errors.role_id && touched.role_id
                                        })}
                                    >
                                        <label htmlFor="role_id">
                                            <b>Role<span className='text-danger'>*</span></b>
                                        </label>
                                        <select className="form-control" id="role_id"
                                         onChange={(event)=>this.handleChange(event), handleChange}
                                         value={values.role_id}
                                         onBlur={handleBlur}
                                         name="role_id"
                                         required
                                        >
                                            <option value="">Select user role</option>
                                            {
                                                this.state.allRoles.map((r)=>{
                                                    return (
                                                        <option key={r._id} value={r._id}>{r.name}</option>
                                                    )
                                                })
                                            }
                                            
                                            
    
                                        </select>
    
                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.role_id}
                                        </div>
                                    </div>
                                        ): null
    
    
                                   } 
                               
                                  
                                   
                                    </div>
                                </Modal.Body>
                           
                                <Modal.Footer>
                            
                                        <LaddaButton
                                            className="btn btn-secondary_custom border-0 mr-2 mb-2 position-relative"
                                            loading={false}
                                            progress={0.5}
                                            type='button'
                                            onClick={()=>this.toggleModal('edit')}
                                        
                                            >
                                            Close
                                        </LaddaButton>
    
                                        <LaddaButton
                                            className={`btn btn-${utils.isValid(this.updateUserSchema, this.state.updateUserForm) ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
                                            loading={this.state.isSaving}
                                            progress={0.5}
                                            type='submit'
                                            data-style={EXPAND_RIGHT}
                                            >
                                            {this.state.saveMsg}
                                        </LaddaButton>
                                        </Modal.Footer>
              
                            </form>
                            );
                    }}
                   
                    </Formik>
                
                    
                </Modal>
               
               
                <Modal show={this.state.showCreateModal} onHide={
                    ()=>{ this.toggleModal('create')}
                    } {...this.props} id='create_modal'>
                    <Modal.Header closeButton>
                    <Modal.Title>Create User</Modal.Title>
                    </Modal.Header>

                    <Formik
                    initialValues={this.state.createUserForm}
                    validationSchema={this.createUserSchema}
                    onSubmit={this.createUser}
                    >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm
                    }) => {
                       
                        return (
                        <form
                            className="needs-validation "
                            onSubmit={handleSubmit}
                            noValidate
                        >
                             <Modal.Body>
                                <div className="form-row">
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.full_name && touched.full_name,
                                    "invalid-field":
                                        errors.full_name && touched.full_name
                                    })}
                                >
                                    <label htmlFor="user_name">
                                        <b>Full Name<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="full_name"
                                    placeholder=""
                                    name="full_name"
                                    value={values.full_name}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.full_name}
                                    </div>
                                </div>
                              
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.username && touched.username,
                                    "invalid-field":
                                        errors.username && touched.username
                                    })}
                                >
                                    <label htmlFor="user_name">
                                        <b>Username<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    placeholder=""
                                    name="username"
                                    value={values.username}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.username}
                                    </div>
                                </div>
                           
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.email && touched.email,
                                    "invalid-field":
                                        errors.email && touched.email
                                    })}
                                >
                                    <label htmlFor="email">
                                        <b>Email<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    placeholder=""
                                    name="email"
                                    value={values.email}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.email}
                                    </div>
                                </div>
                           
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.phone_no && touched.phone_no,
                                    "invalid-field":
                                        errors.phone_no && touched.phone_no
                                    })}
                                >
                                    <label htmlFor="user_name">
                                        <b>Phone No.</b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="phone_no"
                                    placeholder=""
                                    name="phone_no"
                                    value={values.phone_no}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.phone_no}
                                    </div>
                                </div>
                           
                                <div
                                    className={utils.classList({
                                    [this.setColClass()]: true,
                                    "valid-field":
                                        !errors.user_type && touched.user_type,
                                    "invalid-field":
                                        errors.user_type && touched.user_type
                                    })}
                                >
                                    <label htmlFor="user_type">
                                        <b>User Type<span className='text-danger'>*</span></b>
                                    </label>
                                    <select className="form-control" id="user_type"
                                     onChange={(event)=>this.handleChange(event)}
                                     value={values.user_type}
                                     onBlur={handleBlur}
                                     name="user_type"
                                     required
                                    >
                                        <option value="">Select User Type</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="BUYER">Buyer</option>
                                        <option value="SELLER">Seller</option>

                                    </select>

                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.user_type}
                                    </div>
                                </div>

                               {
                                    this.state.showRoles ? (
                                        <div
                                    className={utils.classList({
                                    "col-md-6 mb-2": true,
                                    "valid-field":
                                        !errors.role_id && touched.role_id,
                                    "invalid-field":
                                        errors.role_id && touched.role_id
                                    })}
                                >
                                    <label htmlFor="role_id">
                                        <b>Role<span className='text-danger'>*</span></b>
                                    </label>
                                    <select className="form-control" id="role_id"
                                     onChange={(event)=>this.handleChange(event)}
                                     value={values.role_id}
                                     onBlur={handleBlur}
                                     name="role_id"
                                     required
                                    >
                                        <option value="">Select user role</option>
                                        {
                                            this.state.allRoles.map((r)=>{
                                                return (
                                                    <option key={r._id} value={r._id}>{r.name}</option>
                                                )
                                            })
                                        }
                                        
                                        

                                    </select>

                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.role_id}
                                    </div>
                                </div>
                                    ): null


                               } 
                           
                              
                               
                                </div>
                            </Modal.Body>
                       
                            <Modal.Footer>
                        
                                    <LaddaButton
                                        className="btn btn-secondary_custom border-0 mr-2 mb-2 position-relative"
                                        loading={false}
                                        progress={0.5}
                                        type='button'
                                        onClick={()=>this.toggleModal('create')}
                                    
                                        >
                                        Close
                                    </LaddaButton>

                                    <LaddaButton
                                        className={`btn btn-${utils.isValid(this.createUserSchema, this.state.createUserForm) ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
                                        loading={this.state.isSaving}
                                        progress={0.5}
                                        type='submit'
                                        data-style={EXPAND_RIGHT}
                                        >
                                        {this.state.saveMsg}
                                    </LaddaButton>
                                    </Modal.Footer>
          
                        </form>
                        );
                    }}
                   
                    </Formik>
                
                    
                  
                </Modal>
               
                <div className='float-right'>
                    <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create User</Button>
                </div>
        
                <div className="breadcrumb">
                    <h1>Users</h1>
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
                                <h4 className="card-title mb-3">Users</h4>
                                <p>List of users.</p>
                            
                            {/* <div style={{"maxHeight":"500px", "overflowY":"scroll"}}> */}

                       

                            <div className="table-responsive">
                                    <table className="display table table-striped table-hover " id="zero_configuration_table" style={{"width":"100%"}}>
                                        <thead>
                                            <tr className="ul-widget6__tr--sticky-th">
                                                <th>#</th>
                                                <th>Full Name</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Phone No.</th>
                                                <th>Type</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                          this.state.allUsers.length ?  this.state.allUsers.map( (user, index)=>{
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
                                                        {user.username}
                                                        </td>
                                                        <td>
                                                        {user.email}
                                                        </td>
                                                        <td>
                                                        {user.phone_no}
                                                        </td>
                                                        <td>
                                                        {user?.user_type?.toLowerCase()}
                                                        </td>
                                                        <td>
                                                        {user?.role?.name}
                                                        </td>
                                                        <td>
                                                        <Form>

                                                             <Form.Check
                                                                    checked={user.status}
                                                                    type="switch"
                                                                    id={`custom-switch${user._id}`}
                                                                    label={user.status ? 'Enabled' : 'Disabled'}
                                                                    className={user.status ? 'text-success' : 'text-danger'}
                                                                    onChange={()=> this.toggleUser(user)} 
                                                                />
                                                               

                                                            </Form> 
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(user.created_at)}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(user.updated_at)}
                                                        </td>
                                                        
                                                        <td>
                                                        <Dropdown key={user._id}>
                                                            <Dropdown.Toggle variant='secondary_custom' className="mr-3 mb-3" size="sm"> 
                                                            Manage
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                           
                                                            <Dropdown.Item  className='border-bottom' onClick={(event)=>{this.viewUser(event, user)}}>    
                                                                <i className="nav-icon i-Eye text-info font-weight-bold"> </i> View
                                                            </Dropdown.Item>
                                                           

                                                            <Dropdown.Item onClick={()=> {
                                                                this.editUser(user);
                                                            }} className='border-bottom'>
                                                                <i className="nav-icon i-Pen-2 text-success font-weight-bold"> </i> Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='text-danger' onClick={
                                                                ()=>{this.deleteUser(user);}
                                                            }>
                                                                <i className="i-Close-Window"> </i> Delete
                                                            </Dropdown.Item>
                                                            {/* <Dropdown.Item>
                                                                <i className="i-Money-Bag"> </i> Something else here
                                                            </Dropdown.Item> */}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
               
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
                                        <tfoot>
                                            <tr>
                                            <th>#</th>
                                                <th>Full Name</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Phone No.</th>
                                                <th>Type</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>
                                                <th>Action</th>
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

        
createUserSchema = yup.object().shape({
    full_name: yup.string().required("full name is required"),
    username: yup.string().required("user name is required"),
    email: yup.string().email('must be a valid email').required("email is required"),
    phone_no: yup.string(),
    user_type: yup.string().required("user type is required"),
      });

updateUserSchema = yup.object().shape({
    full_name: yup.string().required("full name is required"),
    username: yup.string().required("user name is required"),
    email: yup.string().email('must be a valid email').required("email is required"),
    phone_no: yup.string(),
    user_type: yup.string().required("user type is required"),
    });


}




export default UsersComponent


