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

export class CategoriesComponent extends Component{

    state = {
        editedIndex:0,
        allCategories:[],
        showEditModal:false,
        showCreateModal:false,
        isSaving:false,
        isFetching:true,
        saveMsg:'Save',
        updateMsg:'Update',
        editedCategory: {},
        createCategoryForm: {
            name: "",
            description: "",
            parentId:""
          },
          updateCategoryForm: {
            name: "",
            parentId:"",
            description: "",
          },

    }
    appMainService;
    

    
    constructor(props){
        super(props)
        this.appMainService = new AppMainService();
    }

    componentDidMount(){
         this.getAllCategories()
    }

    /**
     * 
     * @param {*} event 
     * @param {*} errors 
     * @param {*} form 
     */

    handleChange = (event, form='create') => {
        const {createCategoryForm, updateCategoryForm} = this.state
        if(form=='create'){
            createCategoryForm[event.target.name] = event.target.value;
        }else if(form=='edit'){
            updateCategoryForm[event.target.name] = event.target.value;
        }
        this.setState({ createCategoryForm, updateCategoryForm });
    }

    



    /**
     * This method lists all categories
     */
     getAllCategories = async ()=>{
         let isFetching = false;

        this.appMainService.getAllCategories().then(
            (categoriesResponse)=>{
                const allCategories = categoriesResponse;
                allCategories.forEach((cat)=>{
                    const subLevel = cat.ancestors ? cat.ancestors.length : 0;
                    // cat['sub_level'] = subLevel;
                    cat['parent'] = subLevel ? cat.ancestors[subLevel - 1] : null;

                })
                this.setState({ allCategories, isFetching })
                console.log('Categories response', categoriesResponse)
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
     * This method creates a new category
     */
    createCategory = async ()=>{
        const {createCategoryForm, allCategories} = this.state; 
        if(+createCategoryForm.commission >=100){
            const commissionError = {
                type:'error',
                msg:'Sales commision cannot be more than 99%'
            }
            return new AppNotification(commissionError);
        }
        let isSaving = true;
        let saveMsg = 'Saving';
        this.setState({isSaving, saveMsg})
        createCategoryForm['ancestors'] = this.getAncestry(createCategoryForm.parentId);
        this.appMainService.createCategory(createCategoryForm).then(
            (categoryData)=>{
                isSaving = false;
                saveMsg = 'Save';
                const subLevel = categoryData.ancestors ? categoryData.ancestors.length : 0;
                // cat['sub_level'] = subLevel;
                categoryData['parent'] = subLevel ? categoryData.ancestors[subLevel - 1] : null;
                allCategories.unshift(categoryData)
                this.setState({ allCategories, isSaving, saveMsg })
                const successNotification = {
                    type:'success',
                    msg:`${categoryData.name} successfully created!`
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
     * This method updates a new category
     */
    updateCategory = async ()=>{

        let {updateCategoryForm, allCategories, editedCategory} = this.state; 
        
        if(+updateCategoryForm.commission >=100){
            const commissionError = {
                type:'error',
                msg:'Sales commision cannot be more than 99%'
            }
            return new AppNotification(commissionError);
        }
        let isSaving = true;
        let updateMsg = 'Updating';
        this.setState({isSaving, updateMsg})
        this.appMainService.updateCategory(updateCategoryForm, editedCategory._id).then(
            (updatedCategory)=>{
                updatedCategory.temp_flash = true
                isSaving = false;
                updateMsg = 'Update';
                allCategories.splice(this.state.editedIndex, 1, updatedCategory)
                this.setState({ allCategories, isSaving, updateMsg })
                const successNotification = {
                    type:'success',
                    msg:`${updatedCategory.name} successfully updated!`
                }
                new AppNotification(successNotification)
                this.toggleModal('edit');

             setTimeout(()=>{
                    updatedCategory.temp_flash = false
                    allCategories.splice(this.state.editedIndex, 1, updatedCategory)
                    this.setState({ allCategories, isSaving, updateMsg })
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
     * This method sets the category to be edited
     *  and opens the modal for edit
     * 
     */
    editCategory = (editedCategory) => {
        const updateCategoryForm = {...editedCategory}
        const editedIndex = this.state.allCategories.findIndex(category => editedCategory._id == category._id)
        this.setState({editedCategory, editedIndex, updateCategoryForm});
        this.toggleModal('edit')
    }


    /**
     * 
     * @param {*} category
     * This method toggles a category's status 
     */
    toggleCategory = (category)=>{
        const toggleMsg = category.status? "Disable":"Enable";
        const gL = category.status? "lose":"gain"
       

        swal.fire({
            title: `<small>${toggleMsg}&nbsp;<b>${category.name}</b>?</small>`,
            text: `${category.name} members will ${gL} permissions.`,
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
                let { allCategories } = this.state
                const toggleIndex = allCategories.findIndex(r => r._id == category._id)
                // category.status = !category.status;

              this.appMainService.toggleCategory(category).then(
                (toggledCategory)=>{
                    allCategories.splice(toggleIndex, 1, toggledCategory)
                    this.setState({ allCategories })
                    const successNotification = {
                        type:'success',
                        msg:`${toggledCategory.name} successfully ${toggleMsg}d!`
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
     * @param {*} category 
     * This method deletes a category
     * 
     */
    deleteCategory = (category)=>{
         swal.fire({
                title: `<small>Delete&nbsp;<b>${category.name}</b>?</small>`,
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
                let { allCategories } = this.state
                  this.appMainService.deleteCategory(category).then(
                    (deletedCategory)=>{
                        allCategories = allCategories.filter(r=> r._id !== category._id)
                        this.setState({ allCategories })
                        const successNotification = {
                            type:'success',
                            msg:`${category.name} successfully deleted!`
                        }
                        new AppNotification(successNotification)
                    }
                ).catch(
                    (error)=>{
                        const errorNotification = {
                            type:'error',
                            msg:utils.processErrors(error)
                        };
                        new AppNotification(errorNotification);
                })}
              
              });
     }

      /**
     * 
     * @param {*} modalName 
     */
    resetForm = ()=> {
        const createCategoryForm = {
            name: "",
            description: "",
          }
          this.setState({createCategoryForm})

    }

    /**
     * This method recursively builds the ancestry of a category using its parentId
     */
    getAncestry = (parentId, ancestry = [])=>{
        
        const {allCategories} =  this.state;
        let immediateParent = allCategories.find(cat=>{
            return parentId == cat._id;
        })
        if(immediateParent){
            const {_id, name} = immediateParent;
            ancestry.push({_id, name});
            if(immediateParent.parentId){
               return this.getAncestry(immediateParent.parentId, ancestry);
            }
        }
        return ancestry.reverse();



    }



    render(){
        
        return (

            <>
                <div className="specific">
        
                <Modal show={this.state.showEditModal} onHide={
                    ()=>{ this.toggleModal('edit')}
                    } {...this.props} id='edit_modal'>
                    <Modal.Header closeButton>
                    <Modal.Title>Update {this.state.editedCategory.name}</Modal.Title>
                    </Modal.Header>
                  
                    <Formik
                    initialValues={this.state.updateCategoryForm}
                    validationSchema={this.updateCategorySchema}
                    onSubmit={this.updateCategory}
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
                                        !errors.name && touched.name,
                                    "invalid-field":
                                        errors.name && touched.name
                                    })}
                                >
                                    <label htmlFor="category_name">
                                        <b>Name<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="category_name"
                                    placeholder=""
                                    name="name"
                                    value={values.name}
                                    onChange={(event)=>this.handleChange(event, 'edit')}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Name is required
                                    </div>
                                </div>

                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.commission && touched.commission,
                                    "invalid-field":
                                        errors.commission && touched.commission
                                    })}
                                >
                                    <label htmlFor="category_commission">
                                        <b>Sales Commision  (%)<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="category_commission"
                                    placeholder=""
                                    name="commission"
                                    value={values.commission}
                                    onChange={(event)=>this.handleChange(event, 'edit')}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                   {errors.commission}
                                    </div>
                                </div>


                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        touched.description && !errors.description,
                                    "invalid-field":
                                        touched.description && errors.description
                                    })}
                                >
                                    <label htmlFor="update_category_description">
                                         <b>Description<span className='text-danger'>*</span></b>
                                    </label>

                                    <textarea className="form-control"
                                    id="update_category_description"  onChange={(event)=>this.handleChange(event,'edit')}
                                    name="description" 
                                    defaultValue={values.description}
                                   />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Description is required
                                    </div>
                                </div>
                            
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
                                        className={`btn btn-${utils.isValid(this.updateCategorySchema, this.state.updateCategoryForm) ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
                                        loading={this.state.isSaving}
                                        progress={0.5}
                                        type='submit'
                                        data-style={EXPAND_RIGHT}
                                        >
                                        {this.state.updateMsg}
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
                    <Modal.Title>Create Category</Modal.Title>
                    </Modal.Header>

                    <Formik
                    initialValues={this.state.createCategoryForm}
                    validationSchema={this.createCategorySchema}
                    onSubmit={this.createCategory}
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
                                        !errors.parentId && touched.parentId,
                                    "invalid-field":
                                        errors.parentId && touched.parentId
                                    })}
                                >
                                    <label htmlFor="parent_category_name">
                                        <b>Parent Category(optional)</b>
                                    </label>
                                    {/* <input
                                    type="text"
                                    className="form-control"
                                    id="category_name"
                                    placeholder=""
                                    name="name"
                                    value={values.name}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    /> */}

                                    <select   className="form-control"
                                    id="parent_category_name"
                                    name="parentId"
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    value={values.parentId}
                                    >
                                        <option value="">Select Parent Category</option>
                                        {
                                            this.state.allCategories.map((cat)=>{
                                               return  (<option value={cat._id} key={cat._id}>{cat.name}</option>)
                                            })
                                       

                                        }

                                    </select>
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Parent Category is required
                                    </div>
                                </div>
                              


                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.name && touched.name,
                                    "invalid-field":
                                        errors.name && touched.name
                                    })}
                                >
                                    <label htmlFor="category_name">
                                        <b>Name<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="category_name"
                                    placeholder=""
                                    name="name"
                                    value={values.name}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Name is required
                                    </div>
                                </div>
                              
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.commission && touched.commission,
                                    "invalid-field":
                                        errors.commission && touched.commission
                                    })}
                                >
                                    <label htmlFor="create_category_commission">
                                        <b>Sales Commission  (%)<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="create_category_commission"
                                    placeholder=""
                                    name="commission"
                                    value={values.commission}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.commission}
                                    </div>
                                </div>


                              
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        touched.description && !errors.description,
                                    "invalid-field":
                                        touched.description && errors.description
                                    })}
                                >
                                    <label htmlFor="create_category_description">
                                         <b>Description<span className='text-danger'>*</span></b>
                                    </label>

                                    <textarea className="form-control"
                                    id="create_category_description"  onChange={(event)=>this.handleChange(event)}
                                    name="description" 
                                    defaultValue={values.description}
                                   />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Description is required
                                    </div>
                                </div>
                            
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
                                        className={`btn btn-${utils.isValid(this.createCategorySchema, this.state.createCategoryForm) ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
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
                    <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Category</Button>
                </div>
        
                <div className="breadcrumb">
                    <h1>Categories</h1>
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
                                <h4 className="card-title mb-3">Categories</h4>
                                <p>List of Categories.</p>
                            
                            {/* <div style={{"maxHeight":"500px", "overflowY":"scroll"}}> */}

                            <div className="table-responsive">
                                    <table className="display table table-striped table-hover " id="zero_configuration_table" style={{"width":"100%"}}>
                                        <thead>
                                            <tr className="ul-widget6__tr--sticky-th">
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Parent Category</th>
                                                <th>Description</th>
                                                <th>Sales Commission (%)</th>
                                                
                                                <th>Status</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                          this.state.allCategories.length ?  this.state.allCategories.map( (category, index)=>{
                                                return (
                                                    <tr key={category?._id} className={category?.temp_flash ? 'bg-success text-white':''}>
                                                        <td>
                                                            <b>{index+1}</b>.
                                                        </td>
                                                        <td>
                                                            {category?.name}
                                                        </td>
                                                        <td>
                                                        {category?.parent?.name || 'None'}
                                                        </td>

                                                        <td>
                                                        {category?.description}
                                                        </td>

                                                        <td className="text-center">
                                                            {category?.commission}
                                                        </td>
                                                       
                                                       
                                                        <td>
                                                        <Form>

                                                             <Form.Check
                                                                    checked={category?.status}
                                                                    type="switch"
                                                                    id={`custom-switch${category?._id}`}
                                                                    label={category?.status ? 'Enabled' : 'Disabled'}
                                                                    className={category?.status ? 'text-success' : 'text-danger'}
                                                                    onChange={()=> this.toggleCategory(category)} 
                                                                />
                                                               

                                                            </Form> 
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(category.created_at)}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(category.updated_at)}
                                                        </td>
                                                        
                                                        <td>
                                                        <Dropdown key={category._id}>
                                                            <Dropdown.Toggle variant='secondary_custom' className="mr-3 mb-3" size="sm"> 
                                                            Manage
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                            <Dropdown.Item onClick={()=> {
                                                                this.editCategory(category);
                                                            }} className='border-bottom'>
                                                                <i className="nav-icon i-Pen-2 text-success font-weight-bold"> </i> Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='text-danger' onClick={
                                                                ()=>{this.deleteCategory(category);}
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
                                                    <td className='text-center' colSpan='9'>
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
                                                <th>Sales Commision (%)</th>
                                                <th>Description</th>
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

createCategorySchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        commission: yup.number().required("Sales commission is required"),
        description: yup.string().required("Description is required"),
        parentId:null
      });


updateCategorySchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        commission: yup.number().required("Sales commission is required"),
        description: yup.string().required("Description is required"),
        parentId:null

        });

}




export default CategoriesComponent


