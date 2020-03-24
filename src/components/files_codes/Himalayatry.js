import React, { Component } from 'react';
import Axios from 'axios';

class Himalayatry extends Component {
    state={
        filepath:"",
        glob:0,
        blob:0
    }
    componentWillMount(){
       this.fetchdata()
    }
    fetchdata=()=>{
        Axios.get('http://localhost:5000/getallfile',{
            headers:{
                'display':'SHOW'
            }
        })
        .then(res=>{
            console.log(res.data)
           
            let newarray = res.data
            let newi=this.state.glob
            let interval=res.data[0].interval
            
            let newinterval=(Number(interval)*1000)
            this.setState({filepath:res.data[newi].filepath})
        
        // for (let i = 0; i < newarray.length; i++) {
        //     this.setState({filepath:newarray[i].filepath})
        //     i+=1
            
        // }
        // setTimeout(3000)
        if (newi < newarray.length -1){
            newi+=1
        }
        else{
            newi=0
        }
        this.setState({glob:newi})
        
        console.log(newi)
        setTimeout(this.fetchdata,newinterval)
           
        })

    }
 
    render() {
        
        
        return (
            <div>
                <div style={box}>
                    <img style={imgstl} src={process.env.PUBLIC_URL +"/"+this.state.filepath}/>
                </div>
            </div>
        );
    }
}
const box={
    width:"100%",
    height:"100%",

   
}
const imgstl={
    width:'100%',
    height:'100%'
}
export default Himalayatry;