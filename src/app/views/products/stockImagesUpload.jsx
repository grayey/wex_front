import React, { Component } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { Button, Card, Row, Col, ProgressBar } from "react-bootstrap";
import FirebaseService  from "../../services/firebase/firebaseAuthService";
import { FaCheck, FaEllipsisH } from "react-icons/fa";

class StockImagesUpload extends Component {

  constructor(props){
    super(props);
  }

  state = {
    dragClass: "",
    files: [],
    statusList: [],
    queProgress: 0,
    ongoingAction:"",
    uploadProgress:0,
    imagesUploaded:0,
  };

  handleFileSelect = event => {
    let files = event.target.files;
    let list = [];
    // let allFiles = this.state.files;

    // allFiles.forEach((f) => {
    // URL.revokeObjectURL(f.preview_url)
    // })
    

    for (const iterator of files) {
        iterator['preview_url'] = this.setImagePreview(iterator)
      list.push({
        file: iterator,
        uploading: false,
        error: false,
        progress: 0
      });
    }

    this.setState({
      files: [...list]
    });
    this.props.setImages(list);
  };

  handleDragOver = event => {
    event.preventDefault();
    this.setState({ dragClass: "drag-shadow" });
  };

  handleDrop = event => {
    event.preventDefault();
    event.persist();

    let files = event.dataTransfer.files;
    let list = [];

    for (const iterator of files) {
      list.push({
        file: iterator,
        uploading: false,
        error: false,
        progress: 0
      });
    }

    this.setState({
      dragClass: "",
      files: [...list]
    });

    return false;
  };

  handleDragStart = event => {
    this.setState({ dragClass: "drag-shadow" });
  };

  handleSingleRemove = index => {
    let files = [...this.state.files];
    files.splice(index, 1);
    this.setState({
      files: [...files]
    });
    this.props.setImages(files);
  };

  handleAllRemove = () => {
    const files = [];
    this.setState({ files, queProgress: 0 });
  };

  uploadSingleFile = index => {
    let allFiles = [...this.state.files];
    let file = this.state.files[index];

    allFiles[index] = { ...file, uploading: true, error: false };

    this.setState({
      files: [...allFiles]
    });
  };

  uploadAllFile = () => {
    let allFiles = [];

    this.state.files.map(item => {
      allFiles.push({
        ...item,
        uploading: true,
        error: false
      });

      return item;
    });

    this.setState({
      files: [...allFiles],
      queProgress: 35
    });
  };

  handleSingleCancel = index => {
    let allFiles = [...this.state.files];
    let file = this.state.files[index];

    allFiles[index] = { ...file, uploading: false, error: true };

    this.setState({
      files: [...allFiles]
    });
  };

  handleCancelAll = () => {
    let allFiles = [];

    this.state.files.map(item => {
      allFiles.push({
        ...item,
        uploading: false,
        error: true
      });

      return item;
    });

    this.setState({
      files: [...allFiles],
      queProgress: 0
    });
  };

  setImagePreview =  (file)=>{
    return URL.createObjectURL(file);
  }

  setActionIcon = (progress) => {
    let progressIcon = (<i className="nav-icon i-Close-Window font-weight-bold"></i>);
    if(progress && progress < 99) return <FaEllipsisH/>;
    if(progress && progress > 99) return <FaCheck/>

    return progressIcon;

  }


  uploadImagesToFirebase = async () => {
    
    const { files } = this.state;
    const imageFiles = files.map((f)=> f.file);
    
    

    for (var i = 0; i < imageFiles.length; i++) {
      var imageFile = imageFiles[i];
      await this.uploadImageAsPromise(imageFile,i).then((res)=>{
       console.log(res, "Upload response");
       
        });
  }
  this.setState({imagesUploaded:0, uploadProgress:0});
    

  }

  /**
   * 
   * @param {*} imageFile 
   * this method uploads images to firebase
   */
  uploadImageAsPromise = async (imageFile, i) => {
    // console.log(imageFile, "Image file")
    let { files, imagesUploaded, uploadProgress } = this.state;
    imagesUploaded = i +1;
    const noOfImages = files.length;
    

    const {name} = imageFile;
    const date = new Date();
    const path = `documents/${name.split(' ').join('')}-${date.getTime()}`;
    const fileRef = FirebaseService.storage.ref(path);

    return new Promise( (resolve, reject) => {
      var task = fileRef.put(imageFile);

      //Update progress bar
      task.on('state_changed',
           (snapshot) => {
              var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                   imageFile['progress'] = percentage;
                   uploadProgress = Math.round(percentage) ? imagesUploaded /noOfImages * percentage : uploadProgress ; // something wrong here
                   files[i] = imageFile;
                   this.setState({files,imagesUploaded,uploadProgress});
          },
          (err)=>{
              reject(err);
          },
          ()=>{
              var downloadURL = fileRef.getDownloadURL().then(
                (url)=>{
                  imageFile['preview_url'] = url;
                  files[i] = imageFile;
                  this.setState({files})
                }).catch(
                  (error)=>{
                  console.error('Download Url error', error)
                });
              
              resolve(downloadURL);
          }
      );
  });

  

  }

  async componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const {imagesCommand} = nextProps;
      let {files, ongoingAction} = this.state;

      if(imagesCommand == 'clr' && this.props.imagesCommand !== imagesCommand){ // clearImages
        files = [];
        ongoingAction = "clr";
        this.setState({files, ongoingAction});
        this.props.setImages(files);

      }else if(imagesCommand == 'upld'){
        await this.uploadImagesToFirebase();
        console.log("After ", files)
        this.props.setImages(files,'clr'); // pass control back to parent
      }
    }
   }
  render() {
    let { dragClass, files, queProgress } = this.state;
    let isEmpty = files.length === 0;

    return (
      <div>

        <div className="row">
            <div className="col-md-5">

                
          <div className="d-flex flex-wrap mb-2">
            {/* <label htmlFor="upload-single-file">
              <Button className="btn-rounded" as="span">
                <div className="flex flex-middle">
                  <i className="i-Share-on-Cloud"> </i>
                  <span>Single File</span>
                </div>
              </Button>
            </label>
            <input
              className="d-none"
              onChange={this.handleFileSelect}
              id="upload-single-file"
              accept=".png,.jpeg,.jpg,.gif"
              type="file"
            />
            <div className="px-3"></div> */}
            
            <label htmlFor="upload-multiple-file">
              <Button className="btn-rounded" as="span">
                <div className="flex flex-middle">
                  <i className="i-Share-on-Cloud "> </i>
                  <span>Add Image(s)</span>
                </div>
              </Button>
            </label>
            <input
              className="d-none"
              onChange={this.handleFileSelect}
              id="upload-multiple-file"
              type="file"
              accept=".png,.jpeg,.jpg,.gif"
              multiple
            />
          </div>

          <div
            className={`${dragClass} dropzone mb-4 d-flex justify-content-center align-items-center`}
            onDragEnter={this.handleDragStart}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
          >
            {isEmpty ? (
              <span>Drop your files here</span>
            ) : (
              <h5 className="m-0">
                {files.length} file{files.length > 1 ? "s" : ""} selected...
              </h5>
            )}
          </div>


                </div>
                <div className="col-md-7">

                    <div className="table-responsive">
                      <div style={{"maxHeight":"200px", "overflowY":"scroll"}}>
                         
                          <table className="table table-striped">
                              <thead>
                                  <tr className="ul-widget6__tr--sticky-th">
                                      <th>Image</th>
                                      <th>Progress</th>
                                      <th>Action</th>
                                  </tr>

                                  {
                                    this.state.uploadProgress ? (
                                      <tr className="ul-widget6__tr--sticky-th" >
                                      <td colSpan="3">
                                        <ProgressBar now={this.state.uploadProgress} variant={Math.ceil(this.state.uploadProgress) !==  100 ? "primary"  : "success"} className="progress-thin"></ProgressBar>
                                        <span>{this.state.imagesUploaded}/{this.state.files.length}</span>
                                      </td>
                                    </tr>
                                    ):null

                                  }
                               
                                  </thead>
                              

                              <tbody>
                                
                                  {
                                  files.length ? 
                                  
                                  files.map((item, index) => {
                                  let { file, uploading, error, progress, preview_url } = item;
                                  return (
                                      <tr key={index}>
                                              <td>
                                            
                                                  <img src={file?.preview_url || preview_url} alt="Product image" className="rounded-circle m-0 avatar-sm-table" />
                                              </td>
                                              <td> 
                                                  <ProgressBar now={progress} variant={progress !==  100 ? "primary"  : "success"} className="progress-thin"></ProgressBar>
                                                  <small>{ Math.ceil(progress) || "0" }%</small>
                                                 

                                              </td>
                                              <td> 
                                                  <span className={`cursor-pointer text-${progress && progress > 99 ? "success" : progress && progress < 99 ? "primary" : "danger"} mr-2`} onClick={() => this.handleSingleRemove(index)}>
                                                      {/* <i className="nav-icon i-Close-Window font-weight-bold"></i> */}
                                                      {this.setActionIcon(progress)}
                                                  </span>
                                  
                                              </td>
                                          </tr>
                                  );})
                                
                                  :

                                  (
                                    <tr>
                                      <td className="text-center" colSpan="3">Please add stock images</td>
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
    );
  }
}

export default StockImagesUpload;
