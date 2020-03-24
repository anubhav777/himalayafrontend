import React, { Component } from 'react';
import Axios from 'axios'
import {Formik,ErrorMessage} from 'formik'
import * as Yup from 'yup'
import Noty from 'noty'
import {Link} from 'react-router-dom'


class Himalayahome extends Component {
    state={
        file:"",
        albumname:"",
        interval:10,
        albums:[]
    }
    componentWillMount(){
      
        this.getalbums()
    }
    getalbums=async()=>{
        await Axios.get('http://localhost:5000/getallalbum')
        .then(res=>{
            let data=res.data
            console.log(res.data)
            this.setState({albums:data})
        })

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
    updatevalue=async(e)=>{
        let newarray=[...this.state.albums]
        let updatearray=null
        if(e.target.checked ){
            
            updatearray=newarray.map(val=>{
                
                if(val.id == e.target.name){
                    val.status=e.target.value
                    
                }
                else{
                    val.status="None"
                }
                return val
            })
            
        }
        else{

        updatearray=newarray.map(val=>{
                
                if(val.id == e.target.name){
                    val.status="None"
                    e.checked=false
                }
                return val
            })
          
        }
        this.setState({albums:updatearray})
      
    }
    delete=(id)=>(e)=>{
        Axios.delete(`http://localhost:5000/deletealbum/${id}`)
        .then(res=>{
            console.log(res.data)
            this.getalbums()
            if(res.status===200){
                this.notification(res.data.status,'success')
            }
            else{
                this.notification('the files could not be deleted','error')
            }
        })
    }
    updatefile=(e)=>{
        this.setState({file:e.target.files})
    }
    addfile=(newid)=>{
        console.log(newid)
        let formdata=new FormData()
        

        for (const key of Object.keys(this.state.file)){
            formdata.append("file",this.state.file[key])
            formdata.append("albumid",newid)
        }
        try{
            Axios.post(`http://localhost:5000/uploadfile`,formdata,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            .then(res=>{
                console.log(res.data)
                
               
            })
    
           }
           catch(err){
                console.log(err)
           }

    }
    sendata=(e)=>{
        e.preventDefault()
        
        let filteredalbum=[...this.state.albums]
        
        for (let i = 0; i < filteredalbum.length; i++) {
            
            let newarray=JSON.stringify(filteredalbum[i])
            
            
            let id=filteredalbum[i].id
     
            this.putalbum(id,newarray)
            this.putfile(id)
            
               
            
            
            
        }

       

    }
    change=(id)=>(e)=>{
     let newalbums=this.state.albums.map(val=>{
         if(val.id == id){
             val.interval=e.target.value
         }
         return val
     })

        this.setState({albums:newalbums})

    }
    updateinterval=(id)=>(e)=>{
        if(e.key == "Enter"){
            this.state.albums.map(val=>{
                if(val.id == id){
                    console.log(val)
                    this.putalbum(val.id,val)
                    this.putfile(val.id)
                }
                return val
            })
            
        }
    }
    putalbum=(id,array)=>{
               
        Axios.put(`http://localhost:5000/updatealbum/${id}`,array,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>{
            console.log(res.data)
            this.getalbums()
            if(res.status===200){
                this.notification(res.data.status,'success')
            }
            else{
                this.notification('the files could not be deleted','error')
            }
        })
        

    }
    putfile=(id)=>{
        Axios.put(`http://localhost:5000/updatefile/${id}`,{
            headers:{
                'Content-Type':'application/json'
            }
        })

    }
    sortalbums=async(e)=>{
        let array=this.state.albums
        let element=e.target.value
        let fgh=array.sort((a,b)=>{
            
            if(element === "name" || element ==='status' || element === 'date'){
                let c=a[element].toUpperCase()
                let d=b[element].toUpperCase()
                console.log(c,d)
                if(c < d){
                    return -1
                }
                if(c > d){
                    return 1
                }
            }
            else{
                return a[element]-b[element]
            }
          
        })
        await this.setState({albums:fgh})
        console.log(fgh)

    }
    render() {
        return (
            <div>
                 <Formik initialValues={this.state} validationSchema={Yup.object().shape({
                    albumname:Yup.string()
                    .min(2,"Please enter more than 2 character")
                    .max(15,'The character extends more than 15 character')
                    .required("Please enter album name"),
                    interval:Yup.string()
                    .max(2,"Number must not exceed 2 digit")
                    .required("Interval required")

                })} onSubmit={(values,{resetForm})=>{
                   
                    
                    let filteredvalue={'name':values.albumname,'interval':values.interval}
                    let newvalues=JSON.stringify(filteredvalue)
                    setTimeout(()=>{ Axios.post('http://localhost:5000/album',newvalues,{
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res=>{
                        console.log(res)
                      
                        if(res.data.status === "Album sucessfully created"){
                            let newid=res.data.data.id
                            this.addfile(newid);
                            this.getalbums();
                            console.log(res.data.status)
                            this.notification(res.data.status,'success')
                        }
                        else{
                            this.notification(res.data.status,'error')
                        }


                        
                    
                    })
                   
                        resetForm({values:this.initialValues})
                       
                      
                       console.log(values)
                    
                   },500) 
                   
                    
                }}>
                    {({values,handleChange,handleBlur,handleSubmit,isSubmitting})=>(

                                <div className="page-wrapper bg-gra-02 p-t-130 p-b-100 font-poppins">
                                <div className="wrapper wrapper--w680">
                                    <div className="card card-4">
                                        <div className="card-body">
                                            <h2 className="title">Add New Album</h2>
                                            <form onSubmit={handleSubmit}>
                                            <div className="row row-space">
                                                    <div className="col-2">
                                                        <div className="input-group">
                                                            <label className="label">Album Name</label>
                                                            <input className="input--style-4" type="text" name="albumname" id="name" value={values.albumname}
                                                    onChange={handleChange} onBlur={handleBlur}/>
                                                     <ErrorMessage style={err} name="albumname" component="div"/>
                                                    
                                                        </div>
                                                    </div>
                                                    <div className="col-2">
                                                        <div className="input-group">
                                                            <label className="label">Image Interval</label>
                                                            <input className="input--style-4" type="text" name="interval"  id="interval" value={values.interval}
                                                    onChange={handleChange} onBlur={handleBlur}/>
                                                     <ErrorMessage style={err} name="interval" component="div"/>
                                                    
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row row-space">
                                                            <div className="col-2">
                                                                <div className="input-group">
                                                                    <label className="label">Choose FIles</label>
                                                                    <input className="input--style-5" type="file" multiple name="file" 
                                                            onChange={this.updatefile}/>
                                                            
                                                                </div>
                                                            </div>
                                                            </div>
                                            
                                                
                                        
                                                    
                                                <div className="p-t-15">
                                                    <button className="btn btn--radius-2 btn--blue"  disabled={isSubmitting} type="submit">Add</button>
                                            </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                </div>
                    )}
            
              </Formik>
              
            
              
              <div className="page-wrapper bg-gra-02 p-t-130 p-b-100 font-poppins" style={ml}>
                  <div className="employee-description">
                <div className="container">
                        <div className="dab">
                        <select onChange={this.sortalbums}>
                  <option value="name">Name</option>
                  <option value="date">Date</option>
                  <option value="interval">Interval</option>
                  <option value="status">Status</option>
              
              </select>
                            <div style={{width:this.state.width}} className="employee-description-table">
                                <h1>Albums</h1>
                            <table>
                                    <thead>
                                    <tr>
                                              <th>#</th>
                                              <th>Albumname</th>
                                              <th>Status</th>
                                              <th>Date</th>
                                              <th>Interval</th>
                                              <th>Uploaded By</th>
                                              <th>Delete</th>
                                            </tr>
                                    </thead>
                                  <tbody >
                                  {this.state.albums.length >= 1 ? (this.state.albums.map((val)=>{
                                                
                                                  return(
                                                      <tr style={txt}>
                                                        <th scope="row"><input type="checkbox" name={val.id} value="Approved" onChange={this.updatevalue} checked={val.status === "Approved" ? true : false}/></th>
                                                        <td><img style={image} src={process.env.PUBLIC_URL +"/Public/album.png"}/><Link to={`/filealbum?page=${val.id}`}>{val.name}</Link></td>
                                                        <td>{val.status}</td>
                                                        <td>{val.date}</td>
                                                        <td><input className="input--style-4" style={wdth} type="number" name="interval" value={val.interval} onChange={this.change(val.id)} onKeyPress={this.updateinterval(val.id)}/></td>
                                                        
                                                        <td></td>
                                                        <td><button className="btn btn--radius-2 btn--blue "  onClick={this.delete(val.id)}>Delete</button></td>
                
                                                      </tr>
                                                )
                                              })) : <tr><h1>No images</h1></tr>}
                                  </tbody>
                                </table>
                               
                            </div>
                            <button className="btn btn--radius-2 btn--blue" onClick={this.sendata} >Update</button>
                        </div>
                   
                </div>
            </div>
            </div>

            </div>
        );
    }
}
const err={
    color:"red"
}
const ml={
    marginLeft:"10%",
    marginTop:"-200px"
}
const txt={
    textAlign:"center"
}
const image={
    width:'50px',
    height:'50px'
}
const tbl={
    marginTop:"50px"
}
const btnlf={
    marginLeft:'50px'
}
const wdth={
    width:'150px'
}


export default Himalayahome;