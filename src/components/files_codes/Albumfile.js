import React, { Component } from 'react';
import Axios from 'axios';
import Noty from 'noty'

class Albumfile extends Component {
    state={
        file:"",
        array:[]
    }
    uploadstaus=(e)=>{
        this.setState({file:e.target.files})

    }
    componentWillMount(){
       this.getdata()
    }
    notification(args,kwargs){
        console.log(kwargs)
        new Noty({
            type:`${kwargs}`,
            theme:'mint',
            layout:'center',
            text:`${args}`,
            timeout:3000
        }).show()
    }
    getdata=()=>{
        let url=window.location.href
        let newsplit=url.split('=',2)
        let newurl=newsplit[1]
        Axios.get(`http://localhost:5000/getallfile?albumid=${newurl}`)
        .then(res=>{
            console.log(res.data)
            this.setState({array:res.data})
        })

    }
    postdata=(e)=>{
        e.preventDefault()
        let url=window.location.href
        let newsplit=url.split('=',2)
        let newurl=newsplit[1]
        console.log(newurl)
        let formdata= new FormData()
        for (const key of Object.keys(this.state.file)){
            formdata.append('file',this.state.file[key])
        }

       try{
        Axios.post(`http://localhost:5000/uploadfile?albumid=${newurl}`,formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then(res=>{
            console.log(res.data)
            this.getdata()
            console.log(res.status)
            if(res.status===200){
                this.notification(res.data.status,'success')
            }
            else{
                this.notification('the files could not be uploade','error')
            }
           
        })

       }
       catch(err){
            console.log(err)
       }
       
    }
    deletefile=(id)=>(e)=>{
        e.preventDefault()
        Axios.delete(`http://localhost:5000/deletefile/${id}`)
        .then(res=>{
            console.log(res.data)
            this.getdata()
            // this.notification(res.data.status,'success')
            if(res.status===200){
                this.notification(res.data.status,'success')
            }
            else{
                this.notification('the files could not be deleted','error')
            }
        })
    }
    render() {
        return (
            <div>
        <div className="page-wrapper bg-gra-02 p-t-130 p-b-100 font-poppins" style={ml}>
                  <div className="employee-description">
                <div className="container">
                        <div className="dab">
                            <div  className="employee-description-table">
                                <table>
                                    <thead>
                                    <tr>
                                              <th>Images</th>
                                              <th>Imagename</th>
                                              <th>Status</th>
                                              <th>Date</th>
                                              <th>Uploaded By</th>
                                              <th>Delete</th>
                                            </tr>
                                    </thead>
                                  <tbody >
                                  {this.state.array.length >= 1 ? (this.state.array.map((val)=>{
                                                  return(
                                                      <tr>
                                                        <th scope="row"><img style={image} src={process.env.PUBLIC_URL +"/"+ val.filepath}/></th>
                                                        <td>{val.filename}</td>
                                                        <td>{val.status}</td>
                                                        <td>{val.date}</td>
                                                        <td></td>
                                                        <td><button className="btn btn--radius-2 btn--blue" onClick={this.deletefile(val.id)}>Delete</button></td>
                
                                                      </tr>
                                                  )
                                              })) : <tr><h1>No images</h1></tr>}
                                  </tbody>
                                </table>
                            </div>
                           
                        </div>
                   
                </div>
            </div>
            <div className="page-wrapper bg-gra-02 p-t-130 p-b-100 font-poppins" >
        <div className="wrapper wrapper--w680">
            <div className="card card-4">
                <div className="card-body">
                    <h2 className="title">Upload Image</h2>
                    <form onSubmit={this.postdata}>
                        <div className="row row-space">
                        <div className="col-2">
                                <div className="input-group">
                                <label className="label">File</label>
                                    <input  type="file" multiple name="file" id="try" onChange={this.uploadstaus}/>
                           
                                </div>
                            </div>
                                          </div>                  
                        <div className="p-t-15">
                            <button className="btn btn--radius-2 btn--blue" type="submit">Upload</button>
                            
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
            </div>






   
            </div>
        );
    }
}
const ml={
    marginLeft:"15%"
}
const mt={
    marginTop:"-200px"
}
const image={
    width:'50px',
    height:'50px'
}
export default Albumfile;