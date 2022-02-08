import React, { Component } from 'react'

class Xss extends Component {
    constructor() {
        super();
        this.state = {
            name: this.name,
            email: this.email,
            website: this.website
          }
        this.saveData = this.saveData.bind(this);
        this.updateForm = this.updateForm.bind(this);
    }
    updateForm() {
        document.getElementById('updated').setAttribute('hidden', true);
        document.getElementById('update').removeAttribute('hidden');
    }

    async saveData() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const website = document.getElementById('website').value;
        const request = await fetch(`/react-xss`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, website: website })
        });
        const response = await request.json();
        console.log(response)
        this.setState({name: response.name, email: response.email, website: response.website})
        document.getElementById('update').setAttribute('hidden', true);
        document.getElementById('updated').removeAttribute('hidden');
        
    }
    render() {
        return (
            <div>
                <br />
                <div className='container' >
                    <h2>React XSS</h2>
                    <br />
                    <p>Application is using ReactJS which provides by default protection from XSS attacks by
                    encoding dangerous characters before appending it to the page but there are
                    cases when it will not protect you from XSS attacks. In this exercise your goal is to
                    find out how you can perform XSS in ReactJS applications.</p>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Update Profile</h5>
                            <div id="update">
                                <p className="card-text">
                                    Name:  <input type="text" id="name"></input><br /><br />
                            Email:  <input type="email" id="email"></input><br /><br />
                            Website: <input type="website" id="website" placeholder="https://example.com"></input> <br /><br />
                                    <button onClick={this.saveData}>Save</button>
                                </p>
                            </div>
                            <div id="updated" hidden>
                                <p className="card-text">
                                    Name:  {this.state.name} <br /><br />
                                    Email:  {this.state.email} <br /><br />
                                    Website: <a href={this.state.website}>{this.state.website}</a> <br /><br />
                                    <button onClick={this.updateForm}>Edit</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Xss;
