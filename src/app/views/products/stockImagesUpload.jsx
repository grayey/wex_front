import React, { Component } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { Button, Card, Row, Col, ProgressBar } from "react-bootstrap";

class StockImagesUpload extends Component {
  state = {
    dragClass: "",
    files: [],
    statusList: [],
    queProgress: 0
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
  };

  handleAllRemove = () => {
    this.setState({ files: [], queProgress: 0 });
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

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Progress</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                            

                             <tbody>
                               
                                {files.map((item, index) => {
                                let { file, uploading, error, progress } = item;
                                return (
                                    <tr key={index}>
                                            <td>
                                           
                                                <img src={file?.preview_url} alt="Product image" className="rounded-circle m-0 avatar-sm-table" />
                                            </td>
                                            <td> 
                                                <ProgressBar now={progress} variant="success" className="progress-thin"></ProgressBar>
                                            </td>
                                            <td> 
                                                <span className="cursor-pointer text-danger mr-2" onClick={() => this.handleSingleRemove(index)}>
                                                    <i className="nav-icon i-Close-Window font-weight-bold"></i>
                                                 </span>
                                
                                            </td>
                                        </tr>
                                );})}
                        </tbody>
                        
                        </table>

                    </div>

                </div>

            </div>
       
      </div>
    );
  }
}

export default StockImagesUpload;
