import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      buttonName: "ADD",
      // editbutton: false,
      // addbutton: true,
      _isMounted:true,
      items:[],
      currentItem:{
        key:'',
        name:'',
        age:'',
        class:''
        // key:'' 
      }
    }
    this.handleName = this.handleName.bind(this);
    this.handleAge = this.handleAge.bind(this);
    this.handleClass = this.handleClass.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
  }

  handleName(e){
    this.setState({
      currentItem:{
        ...this.state.currentItem,
        key: Math.floor((Math.random()*100)+1),
        name: e.target.value,
        // key: new Date()
        }
    })
  }

  handleAge(e){
    this.setState({
      currentItem:{
        ...this.state.currentItem,
        age: e.target.value,
        }
    })
  }

  handleClass(e){
    this.setState({
      currentItem:{
        ...this.state.currentItem,
        class: e.target.value,
        }
    })
  }
  
  componentDidMount() {  
    this._isMounted = true;
    axios({
      method:'get',
      url:'/users'      
    }).then(response=>{
      if(this.state._isMounted){
      this.setState({items:response.data.data})
      }
    }).catch(error=>{
      console.log(error);
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  editItem(id){
  const filteredItem = this.state.items.find( item => item.key === id);
  if(filteredItem)
  this.setState( {
    currentItem:{...filteredItem},
    buttonName: "UPDATE",
  }
  )
  }

  deleteAll(){
    axios.delete(
      `users/`,
      {
       
      }
      ).then(response=>{
      if(this.state._isMounted){
      }
    }).catch(error=>{
      console.log(error);
    })
    this.componentDidMount();
  }

  deleteItem(id){
          axios.delete(
          `users/delete/${id}`,
          {
            data: { id:id }
          }
          ).then(response=>{
          if(this.state._isMounted){
          }
        }).catch(error=>{
          console.log(error);
        })
        this.componentDidMount();
      }
  
  addItem(e){
    e.preventDefault();
    const newItem = this.state.currentItem;
      const newItems = [...this.state.items,newItem];
      this.setState({
        items:newItems,
        currentItem:{
          key:'',
          name:'',
          age:'',
          class:''
        }
      })

      const params = JSON.stringify({...this.state.currentItem});

      axios.post(
        'users/create/',
        params,{
          headers: {
          "content-type": "application/json",
          },
        }).then(response=>{
        if(this.state._isMounted){
        }
      }).catch(error=>{
        console.log(error);
      })
  }

  formSubmit(e){
    if(this.state.buttonName === "ADD")
      this.addItem(e)
    else 
      this.updateItem();
  }

  updateItem(){
    const params = JSON.stringify( {...this.state.currentItem});
      axios.put(
        `users/update/${this.state.currentItem.key}`,
        params,{
          headers: {
          "content-type": "application/json",
          },
        }).then(response=>{
        if(this.state._isMounted){
        }
      }).catch(error=>{
        console.log(error);
      })
      this.setState({
        editbutton:false,
        addbutton:true
      })
  }
  
  render () {
    return (
      <div>
      <center><h2>CRUD with NestJs</h2> </center>
      <div className="App">
      <header>
        <form id="to-do-list" onSubmit={this.formSubmit}>
          <input type="name" placeholder="Enter Name"
            value={this.state.currentItem.name}
            onChange={this.handleName}
            />

            <input type="age" placeholder="Enter Age"
            value={this.state.currentItem.age}
            onChange={this.handleAge}
            />

            <input type="class" placeholder="Enter Class"
            value={this.state.currentItem.class}
            onChange={this.handleClass}
            />
          <button type="submit" style={{ marginLeft:"280px", marginTop:"-70px"}}> {this.state.buttonName} </button>

        </form>
        </header>
        
        <ListItems items={this.state.items} deleteAll={this.deleteAll} editItem={this.editItem} deleteItem={this.deleteItem}> </ListItems>
      </div>
      </div>
    );
  }
}

function ListItems(props){
  const items = props.items;
  const listItems = items.map(item => {
       return <div className="list" id="item.id">
              <p>{item.name},{item.age},{item.class} <button className="editbtn" onClick={ () => props.editItem(item.key)}> Edit </button>
              <button className="delbtn" onClick={ () => props.deleteItem(item.key)}> Delete </button> </p> 
       </div> 
  })
  return <div>{listItems}
  
  <button className="delAll" onClick={ () => props.deleteAll()}> Delete All </button>
  
  </div>
}

export default App;
ReactDOM.render(<App />, document.getElementById('root'));