import React from 'react';
import ReactDOM from 'react-dom';
const axios = require('axios');


const NoDept = (props) => {
    return (
        <div className="colContainer" id='NoDept'>
            <div className='title'><span>Employees Without Departments</span></div>
            <hr/>
            {props.emps.map(emp => {
                return(<div key={emp.id} className='entry' onClick={()=> props.delete(emp.id)}>{emp.name}</div>)
            })}
            {
                (props.emps.length ? <div><hr/><div>Click employee to fire them</div></div> : null)
            }
        </div>
        
    )
}

const DeptList = (props) => {
    
    return (
        <div className="colContainer"  id='noDept'>
            <div className='title'><span>Department List</span></div>
            <hr/>
            {props.depts.map(dept => {
                return(<div key={dept.id} className={`entry dept ${props.selectedDept === dept.id ? 'selected' : ''}`} onClick={()=> props.select(dept.id)}>{dept.name}<hr/></div>)
            })}
        </div>
    )
}

const DeptEmps = (props) => {
    const selectedEmps = props.emps.filter(emp => emp.departmentId === props.selectedDept)
    return (
        <div className="colContainer"  id='deptEmps'>
            <div className='title'><span>{`${props.selectedName} Employees`}</span></div>
            <hr/>
            {selectedEmps.map(emp => {
                return(<div key={emp.id} className='entry' onClick={()=>props.fire ? props.delete(emp.id) : props.remove(emp.id)}>{emp.name}</div>)
            })}
            {
                (selectedEmps.length ? <div><hr/><div>{`${props.fire ? 'Click employee to fire them' : 'Click employee to remove them from department'}`}</div><hr/><div><button onClick={()=>props.changeAction()}>{`${props.fire ? 'I do not want to fire anyone' : 'I want to fire someone!'}`}</button></div></div> : null)
            }
        </div>
    )
}

class Page extends React.Component {
    constructor() {
        super();
        this.state= {
            depts: [],
            emps: [],
            selectedDept: null,
            fireMode: true
        }
        this.select = this.select.bind(this);
        this.delete = this.delete.bind(this);
        this.remove = this.remove.bind(this);
        this.changeAction = this.changeAction.bind(this);
    }
    async componentDidMount() {
        const depts = await axios.get('/api/departments');
        const emps = await axios.get('/api/employees');
        this.setState({ 
            depts: depts.data,
            emps: emps.data
         })
    }
    async select(deptId) {
        await this.setState({ selectedDept: deptId})
    }
    async delete(empId) {
        await axios.delete('/api/employees', { data: {'id': empId}});
        this.setState( {emps: this.state.emps.filter(emp => emp.id != empId) });
    }
    async remove(empId) {
        await axios.put(`/api/employees/${empId}`);
        const removeEmp = this.state.emps.map( emp => emp.id === empId ? {'id': emp.id, 'name': emp.name, 'departmentId': null}: emp );
        this.setState( {emps: removeEmp})
    }
    async changeAction() {
        this.setState( {fireMode: (!(this.state.fireMode)) })
    }
    render() {
        return (
            <div id='columns'>
                <NoDept emps={this.state.emps.filter(emp => emp.departmentId === null)} delete={this.delete} />
                <div className="divider"></div>
                <DeptList depts={this.state.depts} selectedDept={this.state.selectedDept} select={this.select}/>
                <div className="divider"></div>
                <DeptEmps emps={this.state.emps.filter(emp => emp.departmentId != null)} delete={this.delete} remove={this.remove} 
                    fire={this.state.fireMode} changeAction={this.changeAction} selectedDept={this.state.selectedDept} selectedName={this.state.selectedDept ? this.state.depts.filter( dept => dept.id === this.state.selectedDept)[0].name : 'Department'}/>
            </div>
        )}
}

ReactDOM.render(
<Page />,
document.getElementById('app')
);
