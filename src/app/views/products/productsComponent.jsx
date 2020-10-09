import React, { Component, useState, useEffect } from "react"
import { Dropdown, Row, Col, Button,Form, ButtonToolbar,Modal, Carousel } from "react-bootstrap";
import Select from 'react-select';
import { WithContext as ReactTags } from "react-tag-input";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import {FetchingRecords} from "../../appWidgets";
import { FaCog, FaArrowDown } from "react-icons/fa";

import StockImagesUpload from "./stockImagesUpload";


  
import LaddaButton, {
    XL,
    EXPAND_LEFT,
    EXPAND_RIGHT,
    EXPAND_UP,

    CONTRACT,
  } from "react-ladda";

export class ProductsComponent extends Component{

    state = {
        editedIndex:0,
        allProducts:[],
        allCategories:[],
        showEditModal:false,
        showCreateModal:false,
        showManageStockModal:false,
        isSaving:false,
        isFetching:true,
        saveMsg:'Save',
        updateMsg:'Update',
        editedProduct: {},
        viewedProductForStock:{},
        productStocks:[],
        keywords:[],
        images:[],
        imagesCommand:"",
        createStockForm:{
            quantity: "",
            price:"",
            description: "",
        },
        createProductForm: {
            name: "",
            category:"",
            packaging: "",
            delivery_option:""
          },
          updateProductForm: {
            name: "",
            category:"",
            packaging: "",
            delivery_option:""
          },

    }
    appMainService;
    

    
    constructor(props){
        super(props);
        this.appMainService = new AppMainService();
    }

    componentDidMount(){
         this.getAllProducts();
         this.getAllCategories();
    }

    /**
     * 
     * @param {*} event 
     * @param {*} errors 
     * @param {*} form 
     */

    handleChange = (event, form='create') => {
        let {createProductForm, updateProductForm,createStockForm, keywords} = this.state;
        const targetName = event.target.name;
        const targetValue = event.target.value;
        if(form === 'create'){
            createProductForm[targetName] = targetValue;

        }else if(form === 'edit'){
            updateProductForm[targetName] = targetValue;
        }else if(form === 'stock'){
            createStockForm[targetName] = targetValue;
        }

       if(targetName === 'category'){
        keywords = this.setKeyWords(targetValue);
       }

        this.setState({ createProductForm, updateProductForm, keywords });
    }


    handleDelete = i => {
        let { keywords } = this.state;
        if(!keywords[i].isPseudo){ // pseudos are new(manual) additions. You can only delete manual additions
            return;
        }
        this.setState({
            keywords: keywords.filter((tag, index) => index !== i)
        });
      };
    
      handleAddition = keyword => {
          let { keywords } = this.state;
          keyword['isPseudo'] = true;
          keywords.push(keyword);
          this.setState({keywords});
      };
    
      handleDrag = (keyword, currPos, newPos) => {
        if (!newPos || !keyword.isPseudo) return; // cant drag and drop original keywords, i.e ancestors
    
        let { keywords } = this.state;
        keywords.splice(currPos, 1);
        keywords.splice(newPos, 0, keyword);
        this.setState({ keywords });
      };


    /**
     * 
     * @param {*} categoryId 
     * This methods sets keywords
     * 
     */
    setKeyWords = (categoryId) => {

        if(!categoryId){
            return;
        }
        const category =  this.getCategoryById(categoryId);
        let keywords = category['ancestors'] || [];
        keywords = keywords.concat([category]); // add the selected category to keywords
        keywords.forEach(keyword => {
            keyword['id'] = keyword['_id'];
            keyword['text'] = keyword['name'];
            keyword['className'] = 'not-pseudo';       
        });
        return keywords;
    }

    



    /**
     * This method lists all products
     */
     getAllProducts = async () => {
         let isFetching = false;

        this.appMainService.getAllProducts().then(
            (productsResponse)=>{
                const allProducts = productsResponse;
                allProducts.forEach((cat)=>{
                    const subLevel = cat.ancestors ? cat.ancestors.length : 0;
                    // cat['sub_level'] = subLevel;
                    cat['parent'] = subLevel ? cat.ancestors[subLevel - 1] : null;

                })
                this.setState({ allProducts, isFetching })
                console.log('Products response', productsResponse)
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
     * This method lists all categories
     */
    getAllCategories = async ()=>{
       this.appMainService.getAllCategories().then(
           (categoriesResponse)=>{
               const allCategories = categoriesResponse;
               allCategories.forEach((cat)=>{
                   const subLevel = cat.ancestors ? cat.ancestors.length : 0;
                   // cat['sub_level'] = subLevel;
                   cat['parent'] = subLevel ? cat.ancestors[subLevel - 1] : null;

               });
               this.setState({ allCategories })
           }
       ).catch((error)=>{
           const errorNotification = {
               type:'error',
               msg:utils.processErrors(error)
           }
           new AppNotification(errorNotification)
       })
   }


    /**
     * This method creates a new product
     */
    createProduct = async ()=>{
        let {createProductForm, allProducts, keywords} = this.state; 
        let isSaving = true;
        let saveMsg = 'Saving';
        this.setState({isSaving, saveMsg})
        createProductForm['search_path'] = this.getSearchPath(keywords);
        createProductForm['category'] = this.getCategoryById(createProductForm['category']);
        createProductForm['keywords'] = keywords;
        createProductForm['no_of_stocks'] = 1
        this.appMainService.createProduct(createProductForm).then(
            (productData)=>{
                isSaving = false;
                saveMsg = 'Save';
                const subLevel = productData.ancestors ? productData.ancestors.length : 0;
                // cat['sub_level'] = subLevel;
                productData['parent'] = subLevel ? productData.ancestors[subLevel - 1] : null;
                allProducts.unshift(productData);
                keywords = [];
                this.setState({ allProducts, keywords, isSaving, saveMsg })
                const successNotification = {
                    type:'success',
                    msg:`${productData.name} successfully created!`
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
     * This method updates a new product
     */
    updateProduct = async ()=>{

        let {updateProductForm, allProducts, editedProduct} = this.state; 
        
        if(+updateProductForm.commission >=100){
            const commissionError = {
                type:'error',
                msg:'Sales commision cannot be more than 99%'
            }
            return new AppNotification(commissionError);
        }
        let isSaving = true;
        let updateMsg = 'Updating';
        this.setState({isSaving, updateMsg})
        this.appMainService.updateProduct(updateProductForm, editedProduct._id).then(
            (updatedProduct)=>{
                updatedProduct.temp_flash = true
                isSaving = false;
                updateMsg = 'Update';
                allProducts.splice(this.state.editedIndex, 1, updatedProduct)
                this.setState({ allProducts, isSaving, updateMsg })
                const successNotification = {
                    type:'success',
                    msg:`${updatedProduct.name} successfully updated!`
                }
                new AppNotification(successNotification)
                this.toggleModal('edit');

             setTimeout(()=>{
                    updatedProduct.temp_flash = false
                    allProducts.splice(this.state.editedIndex, 1, updatedProduct)
                    this.setState({ allProducts, isSaving, updateMsg })
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
        let {showEditModal, showCreateModal,showManageStockModal } = this.state;
        if(modalName == 'create'){
            showCreateModal = !showCreateModal;
        }else if(modalName == 'edit'){
            showEditModal = !showEditModal
        }else if(modalName == 'manage_stock'){
            showManageStockModal = !showManageStockModal;
        }
        
        this.setState({ showEditModal, showCreateModal, showManageStockModal })
    }



    /**
     * This method sets the product to be edited
     *  and opens the modal for edit
     * 
     */
    editProduct = (editedProduct) => {
        const updateProductForm = {...editedProduct}
        const editedIndex = this.state.allProducts.findIndex(product => editedProduct._id == product._id)
        this.setState({editedProduct, editedIndex, updateProductForm});
        this.toggleModal('edit')
    }


    /**
     * 
     * @param {*} product
     * This method toggles a product's status 
     */
    toggleProduct = (product)=>{
        const toggleMsg = product.status? "Disable":"Enable";
        const gL = product.status? "lose":"gain"
       

        swal.fire({
            title: `<small>${toggleMsg}&nbsp;<b>${product.name}</b>?</small>`,
            text: `${product.name} members will ${gL} permissions.`,
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
                let { allProducts } = this.state
                const toggleIndex = allProducts.findIndex(r => r._id == product._id)
                // product.status = !product.status;

              this.appMainService.toggleProduct(product).then(
                (toggledProduct)=>{
                    allProducts.splice(toggleIndex, 1, toggledProduct)
                    this.setState({ allProducts })
                    const successNotification = {
                        type:'success',
                        msg:`${toggledProduct.name} successfully ${toggleMsg}d!`
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
     * @param {*} product 
     * This method deletes a product
     * 
     */
    deleteProduct = (product)=>{
         swal.fire({
                title: `<small>Delete&nbsp;<b>${product.name}</b>?</small>`,
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
                let { allProducts } = this.state
                  this.appMainService.deleteProduct(product).then(
                    (deletedProduct)=>{
                        allProducts = allProducts.filter(r=> r._id !== product._id)
                        this.setState({ allProducts })
                        const successNotification = {
                            type:'success',
                            msg:`${product.name} successfully deleted!`
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


     editProductStock =  async (viewedProductForStock)=>{
         let canToggle = true;
        
         if(viewedProductForStock.no_of_stocks){ // go to backend and fetch stocks
             viewedProductForStock.fetching_stock = true;
             await this.appMainService.getProductById(viewedProductForStock._id).then(
                 (productStockResponse) =>{
                    viewedProductForStock.fetching_stock = false;
                     viewedProductForStock = productStockResponse;
                    
                 }
             ).catch((error)=>{
                const errorNotification = {
                    type:'error',
                    msg:utils.processErrors(error)
                }
                new AppNotification(errorNotification)
                viewedProductForStock.fetching_stock = false;
                canToggle = false;
             })
         }
    
         const productStocks = viewedProductForStock.stocks || [];
         productStocks.reverse(); // LIFO
          
         this.setState({viewedProductForStock, productStocks});

          return canToggle ?  this.toggleModal('manage_stock') : null;
    
     }

     /**
      * This method adds a new stock
      */
     createStock = ()=> {
         let {imagesCommand, isSaving} = this.state;
         imagesCommand = 'upld'; // pass upload control to StockImagesUpload child
         isSaving = true;
         this.setState({imagesCommand,isSaving})
     }

      /**
     * 
     * @param {*} modalName 
     */
    resetForm = ()=> {
        const createProductForm = {
            name: "",
            description: "",
          }
          this.setState({createProductForm})

    }

 
    /**
     * 
     * @param {*} keywords 
     * @param {*} searchPath 
     * 
     * This method recursively builds the search path from keywords
     */
    
    getSearchPath = (keywords, index = 0, searchPath = '')=>{    
        return index === keywords.length ? searchPath : this.getSearchPath(keywords, index+1, `${searchPath}${keywords[index].text}|`);
    }


    /**
     * 
     * @param {*} categoryId 
     * This method returns a matching category from its ID
     */
    getCategoryById = (categoryId) =>{
        const { allCategories } = this.state;
      return allCategories.find( (category) => {
            return category._id === categoryId;
        });
    }

    setImages = async (images, imagesCommand="") => {
        // let images = files.map(file=> file.file)
        
        let {createStockForm, productStocks,  isSaving, viewedProductForStock } = this.state;
        if(imagesCommand == "clr"){
            console.log("Now clearing", viewedProductForStock);
            const newStock = {...createStockForm};
            newStock['images'] = images;

            // save to backend
           await this.appMainService.createProductStock(viewedProductForStock._id ,newStock).then(
                (stocksResponse) =>{
                createStockForm = {
                    quantity:"",
                    price:"",
                    description:""
                };
                images = [];
                isSaving = false;
                const successNotification = {
                    type:'success',
                    msg:`Added new stock for ${viewedProductForStock.name}.`
                }
                productStocks.unshift(stocksResponse);
                new AppNotification(successNotification)

                }).catch((error)=>{
                    console.log("Error", error)
                    const errorNotification = {
                        type:'error',
                        msg:utils.processErrors(error)
                    }
                    new AppNotification(errorNotification)
                    isSaving = false;
                })
                           
            
        }
        this.setState({images, imagesCommand, createStockForm, productStocks, isSaving});
       
    }


    render(){
        
        return (

            <>
                <div className="specific">



                <Modal show={this.state.showManageStockModal} onHide={
                    ()=>{ this.toggleModal('manage_stock')}
                    } {...this.props} id='manage_stock_modal' size="xl" scrollable={true}>
                    <Modal.Header closeButton>
                    <Modal.Title>

                        {this.state.viewedProductForStock?.no_of_stocks ? "Manage stocks for " : "Add stock(s) to "}

                        <b>{this.state.viewedProductForStock?.name}</b>

                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mt-2">
                        
                                <div className="col-md-12">
                            
                                    <div className="card mr-2 ml-2 mb-2">
                                        <div className="card-header">
                                            <h5 className="text-center"><b>New stock details</b></h5>
                                        </div>

                                    
                                        <div className="card-body" style={{maxHeight:"300px"}}>
                                            <Formik
                                                initialValues={this.state.createStockForm}
                                                validationSchema={this.createStockSchema}
                                                onSubmit={this.createStock}
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
                                            
                                                <div className="form-row">

                                            
                                                <div className="col-md-12 mt-2">

                                                <div className="row">

                                                    <div className="col-md-4 border-right">
                                                        <div className="row">
                                                            
                                                            <div
                                                                className={utils.classList({
                                                                "col-md-6 mb-2": true,
                                                                "valid-field":
                                                                    !errors.quantity && touched.quantity,
                                                                "invalid-field":
                                                                    errors.quantity && touched.quantity
                                                                })}
                                                            >
                                                                <label htmlFor="create_stock_quantity">
                                                                    <b>Quantity(kg)<span className='text-danger'>*</span></b>
                                                                </label>
                                                                <input
                                                                type="number"
                                                                className="form-control"
                                                                id="create_stock_quantity"
                                                                placeholder=""
                                                                name="quantity"
                                                                value={this.state.createStockForm.quantity}
                                                                onChange={(event)=>this.handleChange(event, 'stock')}
                                                                onBlur={handleBlur}
                                                                required
                                                                />
                                                                <div className="valid-feedback"></div>
                                                                <div className="invalid-feedback">
                                                                {errors.quantity}
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={utils.classList({
                                                                "col-md-6 mb-2": true,
                                                                "valid-field":
                                                                    !errors.price && touched.price,
                                                                "invalid-field":
                                                                    errors.price && touched.price
                                                                })}
                                                            >
                                                                <label htmlFor="create_stock_price">
                                                                    <b>Price per kg<span className='text-danger'>*</span></b>
                                                                </label>
                                                                <input
                                                                type="number"
                                                                className="form-control"
                                                                id="create_stock_price"
                                                                placeholder=""
                                                                name="price"
                                                                value={this.state.createStockForm.price}
                                                                onChange={(event)=>this.handleChange(event, 'stock')}
                                                                onBlur={handleBlur}
                                                                required
                                                                />
                                                                <div className="valid-feedback"></div>
                                                                <div className="invalid-feedback">
                                                                {errors.price}
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
                                                                <label htmlFor="create_stock_description">
                                                                    <b>Description<span className='text-danger'>*</span></b>
                                                                </label>

                                                                <textarea className="form-control"
                                                                id="create_stock_description"  onChange={(event)=>this.handleChange(event, 'stock')}
                                                                name="description" 
                                                                value={this.state.createStockForm.description}
                                                            />
                                                                <div className="valid-feedback"></div>
                                                                <div className="invalid-feedback">
                                                                Description is required
                                                                </div>
                                                            </div>

                                                            

                                                        </div>
                                                    </div>
                                                
                                                
                                                    <div className="col-md-8 col-sm-12">
                                            
                                                        <StockImagesUpload  imagesCommand={this.state.imagesCommand} setImages={(images,imagesCommand)=>this.setImages(images,imagesCommand)}/>
                                                    
                                            

                                                    </div>

                                                    </div>

                                                </div>

                                            
                                            

                                                </div>
                                            
                                    
                                                <div className="border-top p-2">
                                        
                                                    {/* <LaddaButton
                                                        className="btn btn-secondary_custom border-0 mr-2 mb-2 position-relative"
                                                        loading={false}
                                                        progress={0.5}
                                                        type='button'
                                                        onClick={()=>this.toggleModal('manage_stock')}
                                                    
                                                        >
                                                        Close
                                                    </LaddaButton> */}

                                                        <div className="float-right">

                                                            <LaddaButton
                                                            className={`btn btn-${utils.isValid(this.createStockSchema, this.state.createStockForm) && this.state.images.length ? 'success':'primary'} border-0 mr-2 mb-2 position-relative`}
                                                            loading={this.state.isSaving}
                                                            disabled={!this.state.images.length || !utils.isValid(this.createStockSchema, this.state.createStockForm)}
                                                            progress={0.5}
                                                            type='submit'
                                                            data-style={EXPAND_RIGHT}
                                                            >
                                                            {"Add stock"} {this.state.isSaving ? null : <FaArrowDown/> }
                                                            </LaddaButton>

                                                        </div>
                                                    </div>
                        
                                        
                                        </form>
                                        );
                                    }}
                                
                                    </Formik>
                                        
                         
                                        </div>
                                    </div>
                                
                                </div>
                            
                        
                            <div className="col-md-12">
                                
                                <div className="cardx mr-2 ml-2 mb-2 ">
                                {/* <div className="card-header">
                                    <h5 className="text-center"><b>List of stocks</b></h5>
                                </div> */}

                                <div className="card-bodyx">
                                    <div className="table-responsive">
                                        <div style={{"maxHeight":"400px", "overflowY":"scroll"}}>
                                            <table id="user_table" className="table table-striped" >
                                                <thead className="thead-darkx">
                                                    <tr className="ul-widget6__tr--sticky-th">
                                                    <th scope="col">Qty. (kg)</th>
                                                    <th scope="col">Price / kg</th>
                                                    <th scope="col" colSpan='2' className="text-center">Images</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                    {
                                        this.state.productStocks.length ?
                                
                                        this.state.productStocks.map((stock, index) => (
                                        <tr key={index}>
                                            {/* <th scope="row">{index + 1}</th> */}
                                            <td>{stock?.quantity}</td>
                                            <td>
                                            &#x20a6;{stock?.price} per kg
                                            </td>

                                            <td colSpan='2' className="text-center">
                                                <b>{(stock?.images?.length)}</b>

                                                <Carousel indicators={false}>
                                        {stock.images.map((img, ind) => (
                                        <Carousel.Item key={ind}>
                                            {/* <img
                                            className="rounded-circle m-0 avatar-sm-table "
                                            src={img}
                                            alt="First slide"
                                            /> */}
                                                
                                                <div className="ul-widget3-img">
                                            <img
                                                src={img.preview_url}
                                                id="userDropdown"
                                                alt=""
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            />
                                            </div>
                                                
                                                    
                                
                                        </Carousel.Item>
                                        ))}
                                    </Carousel>
                                                
                                                
                                                </td>
                                            
                                            <td>
                                            <span
                                                // className={`badge ${this.getUserStatusClass(
                                                //   user.status
                                                // )}`}
                                            >
                                                {stock?.featured ? "featured":""}
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
                                        ))
                                        :

                                        (
                                            <tr>
                                                <td colSpan="6" className="text-center">No stocks for {this.state.viewedProductForStock?.name}</td>
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
                    </Modal.Body>
                    

                    <Modal.Footer>
                        <button className="btn btn-secondary_custom mr-3" onClick={()=>{ this.toggleModal('manage_stock')}}>Close </button>
                        {/* <button className="btn btn-info_custom">Save Stocks</button> */}
                   </Modal.Footer>
                    
                  
                </Modal>
               
              

        
                <Modal show={this.state.showEditModal} onHide={
                    ()=>{ this.toggleModal('edit')}
                    } {...this.props} id='edit_modal'>
                    <Modal.Header closeButton>
                    <Modal.Title>Update {this.state.editedProduct.name}</Modal.Title>
                    </Modal.Header>
                  
                    <Formik
                    initialValues={this.state.updateProductForm}
                    validationSchema={this.updateProductSchema}
                    onSubmit={this.updateProduct}
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
                                    <label htmlFor="product_name">
                                        <b>Name<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="product_name"
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
                                    <label htmlFor="product_commission">
                                        <b>Sales Commision  (%)<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="product_commission"
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
                                    <label htmlFor="update_product_description">
                                         <b>Description<span className='text-danger'>*</span></b>
                                    </label>

                                    <textarea className="form-control"
                                    id="update_product_description"  onChange={(event)=>this.handleChange(event,'edit')}
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
                                        className={`btn btn-${utils.isValid(this.updateProductSchema, this.state.updateProductForm) ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
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
                    } {...this.props} id='create_modal' size="lg">
                    <Modal.Header closeButton>
                    <Modal.Title>Create Product</Modal.Title>
                    </Modal.Header>

                    <Formik
                    initialValues={this.state.createProductForm}
                    validationSchema={this.createProductSchema}
                    onSubmit={this.createProduct}
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
                                    "col-md-6 mb-2": true,
                                    "valid-field":
                                        !errors.name && touched.name,
                                    "invalid-field":
                                        errors.name && touched.name
                                    })}
                                >
                                    <label htmlFor="product_name">
                                        <b>Product Name<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="product_name"
                                    placeholder=""
                                    name="name"
                                    value={values.name}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Product name is required
                                    </div>
                                </div>

                                <div
                                    className={utils.classList({
                                    "col-md-6 mb-2": true,
                                    "valid-field":
                                        !errors.category && touched.category,
                                    "invalid-field":
                                        errors.category && touched.category
                                    })}
                                >
                                    <label htmlFor="product_category">
                                        <b>Category<span className='text-danger'>*</span></b>
                                    </label>

                                    <select   className="form-control"
                                    id="product_category"
                                    name="category"
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    value={values.category}
                                    required
                                    >
                                        <option value="">Select  Category</option>
                                        {
                                            this.state.allCategories.map((cat)=>{
                                               return  (<option value={cat._id} key={cat._id}>{cat.name}</option>)
                                            })
                                       

                                        }

                                    </select>


                                    {/* <input
                                    type="text"
                                    className="form-control"
                                    id="product_category"
                                    placeholder=""
                                    name="category"
                                    value={values.category}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    /> */}

                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Product category is required
                                    </div>

                                </div>




                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.keywords && touched.keywords,
                                    "invalid-field":
                                        errors.keywords && touched.keywords
                                    })}
                                >
                                    <label htmlFor="product_keywords">
                                        <b>Keywords<span className='text-danger'>*</span></b>
                                    </label>
                             

                                    {/* <Select 
                                    name="keywords"    
                                    isMulti
                                    options={this.state.keywords}
                                    placeholder="What type of Product?"
                                /> */}

                            <ReactTags
                                    tags={this.state.keywords}
                                    suggestions={[]}
                                    handleDelete={this.handleDelete}
                                    handleAddition={this.handleAddition}
                                    handleDrag={this.handleDrag}
                                    allowDragDrop={true}
                                    delimiters={[188, 13]}
                                    placeholder = "Type and press enter"
                                    />

                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Keywords is required
                                    </div>
                                </div>

                              
                            
                                <div className="col-md-12 mt-3 mb-2">

                                    <div className="row">

                                                                   

                                    <div className="col-md-5  border-right">
                                        <label
                                            htmlFor="product_packaging"
                                            className="ul-form__label"
                                        >
                                            <b>Packaging<span className='text-danger'>*</span></b>
                                        </label>
                                        <div className="ul-form__radio-inline pl-2">
                                            <label className=" ul-radio__position radio radio-primary form-check-inline">
                                            <input type="radio" value="packed"  name="packaging"
                                             onChange={(event)=>this.handleChange(event)}
                                             checked={values.packaging === "packed"}
                                            />
                                            <span className="ul-form__radio-font pr-2">
                                                packed
                                            </span>
                                            <span className="checkmark"></span>
                                            </label>
                                            <label className="ul-radio__position radio radio-primary">
                                            <input type="radio" value="unpacked" name="packaging"
                                             onChange={(event)=>this.handleChange(event)}
                                             checked={values.packaging === "unpacked"}
                                            />
                                            <span className="ul-form__radio-font">
                                                unpacked
                                            </span>
                                            <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        {/* <small
                                            id="passwordHelpBlock"
                                            className="ul-form__text form-text "
                                        >
                                        Choose Packaging
                                        </small> */}
                                        </div>
                                        

                                        <div className="col-md-7 pl-4">
                                        
                                        <label
                                            htmlFor="product_delivery_option"
                                            className="ul-form__label"
                                        >
                                        
                                            <b>Delivery Option<span className='text-danger'>*</span></b>
                                        </label>
                                        <div className="ul-form__radio-inline pl-2">
                                            <label className=" ul-radio__position radio radio-primary form-check-inline">
                                            <input type="radio" value="BUYER_PICKS_UP"  name="delivery_option"
                                                onChange={(event)=>this.handleChange(event)}
                                              checked={values.delivery_option === "BUYER_PICKS_UP"} />
                                            <span className="ul-form__radio-font pr-2">
                                                buyer will pick up
                                            </span>
                                            <span className="checkmark"></span>
                                            </label>
                                            <label className="ul-radio__position radio radio-primary">
                                            <input type="radio" value="SELLER_DELIVERS" name="delivery_option"
                                            onChange={(event)=>this.handleChange(event)}
                                            checked={values.delivery_option === "SELLER_DELIVERS"}  />
                                            <span className="ul-form__radio-font">
                                                seller will deliver
                                            </span>
                                            <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        {/* <small
                                            id="passwordHelpBlock"
                                            className="ul-form__text form-text "
                                        >
                                        Choose Packaging
                                        </small> */}
                                        </div>
                                    

                                    </div>

        
                                </div>


        
                                <div className="col-md-12">
                                  
                                    <fieldset className="border p-1">
                                    <legend  className="w-auto">
                                        <small className="legend-small">Delivery Charge</small>
                                    </legend>
{/* 
                                    <div className="row">

                                        <div className="col-md-2 mt-2">
                                            &nbsp;&nbsp;I will charge
                                        </div>

                                    <div
                                    className={utils.classList({
                                    "col-md-4 mb-2": true,
                                    "valid-field":
                                        !errors.delivery_within_amount && touched.delivery_within_amount,
                                    "invalid-field":
                                        errors.delivery_within_amount && touched.delivery_within_amount
                                    })}
                                >

                                    
                                        <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">&#x20A6;</span>
                                        </div>
                                        <input
                                            aria-label="Amount (to the nearest naira)"
                                            type="number"
                                            className="form-control"
                                            id="create_product_delivery_charge"
                                            placeholder="Price"
                                            name="delivery_within_amount"
                                            value={values.delivery_within_amount}
                                            onChange={(event)=>this.handleChange(event)}
                                            onBlur={handleBlur}
                                            required

                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text">.00</span>
                                        </div>
                                        </div>

                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.delivery_within_amount}
                                        </div>
     
                                
                                </div>

                                <div className="col-md-2 mt-2">
                                       <b>within</b>
                                        </div>

                                <div
                                    className={utils.classList({
                                    "col-md-4 mb-2": true,
                                    "valid-field":
                                        !errors.delivery_within_distance && touched.delivery_within_distance,
                                    "invalid-field":
                                        errors.delivery_within_distance && touched.delivery_within_distance
                                    })}
                                >

                                            <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">km</span>
                                        </div>
                                        <input
                                            aria-label="Distance (to the nearest km)"
                                            type="number"
                                            className="form-control"
                                            id="create_product_delivery_within_distance"
                                            placeholder="Distance"
                                            name="commission"
                                            value={values.delivery_within_distance}
                                            onChange={(event)=>this.handleChange(event)}
                                            onBlur={handleBlur}
                                            required

                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text">.00</span>
                                        </div>
                                        </div>

                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.delivery_within_amount}
                                        </div>


                                </div>


                                    </div>

                                   */}
                                  
                                    {/* <hr className="legend-hr"/> */}

{/* 
                                    <div className="row">

                                        <div className="col-md-2 mt-2">
                                            &nbsp;&nbsp;I will charge
                                        </div>

                                    <div
                                    className={utils.classList({
                                    "col-md-4 mb-2": true,
                                    "valid-field":
                                        !errors.delivery_beyond_amount && touched.delivery_beyond_amount,
                                    "invalid-field":
                                        errors.delivery_beyond_amount && touched.delivery_beyond_amount
                                    })}
                                >
                                    
                            


                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">&#x20A6;</span>
                                        </div>
                                        <input
                                            aria-label="Amount (to the nearest naira)"
                                            type="number"
                                            className="form-control"
                                            id="create_product_delivery_charge"
                                            placeholder="Price (₦)"
                                            name="commission"
                                            value={values.delivery_beyond_amount}
                                            onChange={(event)=>this.handleChange(event)}
                                            onBlur={handleBlur}
                                            required

                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text">.00</span>
                                        </div>
                                        </div>

                                        <div className="valid-feedback"></div>
                                        <div className="invalid-feedback">
                                        {errors.delivery_beyond_amount}
                                        </div>

                                </div>

                                <div className="col-md-2 mt-2">
                                           <b>beyond</b>
                                        </div>

                                <div
                                    className={utils.classList({
                                    "col-md-4 mb-2": true,
                                    "valid-field":
                                        !errors.delivery_beyond_distance && touched.delivery_beyond_distance,
                                    "invalid-field":
                                        errors.delivery_beyond_distance && touched.delivery_beyond_distance
                                    })}
                                >
            
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="create_product_delivery_beyond_distance"
                                    placeholder="Distance (km)"
                                    name="commission"
                                    value={values.delivery_beyond_distance}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.delivery_beyond_distance}
                                    </div>
                                </div>


                                    </div>

                             */}

                                    </fieldset>

                                
                                </div>


    
                              

{/* 
                              
                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.quantity && touched.quantity,
                                    "invalid-field":
                                        errors.quantity && touched.quantity
                                    })}
                                >
                                    <label htmlFor="create_product_quantity">
                                        <b>Quantity(kg)<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="create_product_quantity"
                                    placeholder=""
                                    name="commission"
                                    value={values.quantity}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.quantity}
                                    </div>
                                </div>

                                <div
                                    className={utils.classList({
                                    "col-md-12 mb-2": true,
                                    "valid-field":
                                        !errors.price && touched.price,
                                    "invalid-field":
                                        errors.price && touched.price
                                    })}
                                >
                                    <label htmlFor="create_product_price">
                                        <b>Price per kg<span className='text-danger'>*</span></b>
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="create_product_price"
                                    placeholder=""
                                    name="commission"
                                    value={values.price}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    {errors.price}
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
                                    <label htmlFor="create_product_description">
                                         <b>Description<span className='text-danger'>*</span></b>
                                    </label>

                                    <textarea className="form-control"
                                    id="create_product_description"  onChange={(event)=>this.handleChange(event)}
                                    name="description" 
                                    defaultValue={values.description}
                                   />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                    Description is required
                                    </div>
                                </div>
                            
                             */}


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
                                        className={`btn btn-${utils.isValid(this.createProductSchema, this.state.createProductForm) ? 'success':'info_custom'} border-0 mr-2 mb-2 position-relative`}
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
                    <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Product</Button>
                </div>
        
                <div className="breadcrumb">
                    <h1>Products</h1>
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
                                <h4 className="card-title mb-3">Products</h4>
                                <p>List of Products.</p>
                            
                            {/* <div style={{"maxHeight":"500px", "overflowY":"scroll"}}> */}

                            <div className="table-responsive">
                            
                                    <table className="display table table-striped table-hover " id="zero_configuration_table" style={{"width":"100%"}}>
                                        <thead>
                                            <tr className="ul-widget6__tr--sticky-th">
                                                <th>#</th>
                                                <th>Product Name</th>
                                                <th>Category</th>
                                                <th className="text-center">Keywords</th>
                                                <th>Packaging</th>
                                                <th>Delivery</th>
                                                <th>Stocks</th>

                                                <th>Status</th>
                                                <th>Date Created</th>
                                                <th>Date Updated</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                          this.state.allProducts.length ?  this.state.allProducts.map( (product, index)=>{
                                                return (
                                                    <tr key={product?._id} className={product?.temp_flash ? 'bg-success text-white':''}>
                                                        <td>
                                                            <b>{index+1}</b>.
                                                        </td>
                                                        <td>
                                                            {product?.name}
                                                        </td>
                                                        <td>
                                                        {product?.category?.name || 'None'}
                                                        </td>

                                                    <td>

                                                        <div className="badges">

                                                        {
                                                                product?.keywords?.map((keyword) => {
                                                                    return (
                                                                    <span className="badge badge-primary badge-sm mr-1" key={keyword.id}>{keyword.text}</span>
                                                                    )
                                                                })
                                                            }

                                                        </div>

                                                            
                                                    </td>

                                                        <td>
                                                        {product?.packaging}
                                                        </td>

                                                        <td className="text-center">
                                                            {product?.delivery_option == 'SELLER_DELIVERS' ? 'Seller delivers': 'Buyer picks up'}
                                                        </td>
                                                       
                                                       <td>
                                                           <div className="btn-group">
                                                           <button disabled={product?.fetching_stock} onClick={()=>this.editProductStock(product)} className={`btn  ${product?.no_of_stocks ? "btn-info_custom":"btn-danger breathe"} btn-sm`}>
                                                               
                                                           {product?.no_of_stocks ? "Manage Stock" :"Add Stock!"} 
                                                               
                                                           </button>
                                                           <button  disabled className="btn btn-warning text-white btn-sm">
                                                               {
                                                                   product?.fetching_stock ? <FaCog className="spin"/> : `(${product?.no_of_stocks})`
                                                               }
                                                              
                                                           </button>
                                                           
                                                           </div>

                                                           {/* {
                                                               product?.no_of_stocks ? null :(
                                                                <p><small className="text-danger">No stock for this product.</small></p>
                                                               )
                                                           } */}
                                                           
                                                          
                                                       </td>
                                                       
                                                        <td>
                                                        <Form>

                                                             <Form.Check
                                                                    checked={product?.status}
                                                                    type="switch"
                                                                    id={`custom-switch${product?._id}`}
                                                                    label={product?.status ? 'Enabled' : 'Disabled'}
                                                                    className={product?.status ? 'text-success' : 'text-danger'}
                                                                    onChange={()=> this.toggleProduct(product)} 
                                                                />
                                                               

                                                            </Form> 
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(product.created_at)}
                                                        </td>
                                                        <td>
                                                        {utils.formatDate(product.updated_at)}
                                                        </td>
                                                        
                                                        <td>
                                                        <Dropdown key={product._id}>
                                                            <Dropdown.Toggle variant='secondary_custom' className="mr-3 mb-3" size="sm"> 
                                                            Manage
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                            <Dropdown.Item onClick={()=> {
                                                                this.editProduct(product);
                                                            }} className='border-bottom'>
                                                                <i className="nav-icon i-Pen-2 text-success font-weight-bold"> </i> Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='text-danger' onClick={
                                                                ()=>{this.deleteProduct(product);}
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
                                        <tr className="ul-widget6__tr--sticky-th">
                                                <th>#</th>
                                                <th>Product Name</th>
                                                <th>Category</th>
                                                <th className="text-center">Keywords</th>
                                                <th>Packaging</th>
                                                <th>Delivery</th>
                                                <th>Stocks</th>

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

createProductSchema = yup.object().shape({
        name: yup.string().required("Product name is required"),
        category:yup.string().required("Product category is required"),
        packaging: yup.string().required("Packaging is required"),
        delivery_option:yup.string().required("Delivery option is required")
      });


updateProductSchema = yup.object().shape({  
        name: yup.string().required("Product name is required"),
        category:yup.string().required("Product category is required"),
        packaging: yup.string().required("Packaging is required"),
        delivery_option:yup.string().required("Delivery option is required")
        });

        createStockSchema =  yup.object().shape({
            quantity: yup.number().required("Stock quantity is required"),
            price:yup.number().required("Stock unit price is required"),
            description: yup.string().required("Description required"),
          });

}




export default ProductsComponent


