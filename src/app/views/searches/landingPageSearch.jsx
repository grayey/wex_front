import React, {useState, useEffect} from "react";
// import PublicHeaderComponent from "./layouts/layout.header";
import AppMainService from "../../services/appMainService";

import Select from 'react-select';
// import "./searches.css";



const appMainService = new AppMainService();


const LandingPageSearch = (props) =>{

    const [activeDiv, setActiveDiv] = useState('')
    const [allCategories, setAllCategories] = useState([])
    const [selectedOption, setSelection] = useState(null)

    useEffect(()=>{
        getAllCategories()
    }, [])

    const setActive = (divId) => {
       
        setActiveDiv(divId);
    }

   const handleChange = option => {
   
       const {label, value} = option;
        setSelection({label,value})
      };


    const getAllCategories = async () =>{
        appMainService.getAllCategories().then(
            (categoriesResponse)=>{
                const allCategories = categoriesResponse.filter(cat=>cat.status).map((c)=>{
                    c.value = c._id;
                    c.label = c.name;
                    return c;
                })
                setAllCategories(allCategories)
            }
        ).catch((error)=>{
           
            console.log("Categories error", error)
        })

    }

    return (
        <>

            <section className="app-search ">

            <div className="row">
               
            <div className="col-md-1"></div>


                <div className="col-md-9">
                <div className="card shadow pr-2 pl-1">
                        <div className="row">
                        <div className={`col-md-4  search-field ${activeDiv == 'product_loc' ? 'active_field' :''}`} id="product_loc">
                            <label>Location</label>
                        <input className="form-control" onClick={()=>{setActive('product_loc')}} placeholder="Where is the item?" />
                        </div>
                        <div className={`col-md-3  search-field ${activeDiv == 'product_cat' ? 'active_field' :''}`} id="product_cat" onClick={()=>{setActive('product_cat')}}>
                        <label >Category</label>
                            {/* <select className="form-control " onClick={()=>{setActive('product_cat')}}>
                                <option value="" className="text-muted category_list">What type of product?</option>

                                {
                                allCategories.length ?  allCategories.map((category)=>{
                                        return (
                                            <option key={category?._id} className="category_list">{category?.name}</option>

                                        )
                                    }) :

                                    (
                                        <option value="" disabled className="text-muted category_list">No availble category.</option>
                                    )

                                }
                                
                            </select> */}

                            <Select
                                    
                                    value={selectedOption}
                                    onChange={handleChange}
                                    options={allCategories}
                                    placeholder="What type of Product?"
                                />

                        </div>
                        <div className={`col-md-3  search-field no-right ${activeDiv == 'product_qty' ? 'active_field' :''}`} id="product_qty">
                        <label>Quantity</label>
                    
                                <input className="form-control" onClick={()=>{setActive('product_qty')}} type="number" placeholder="Weight in  kg" />
                        </div>
                        <div className="col-md-2 mt-3 mb-2">
                        <button  className="search_btn btn float-right" target="_blank" id="cta-home-hero-getpoyntx"><i className="search-icon i-Magnifi-Glass1"></i>&nbsp; Search</button>
                        </div>
                        
                        </div>
            </div>

                </div>
                
            
                <div className="col-md-2">

</div>
            </div>

                
            </section>




        </>
    )
   



}



export default LandingPageSearch;