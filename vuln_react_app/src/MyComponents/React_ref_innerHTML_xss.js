import React, { Component } from 'react'
import ReactDOM from 'react-dom';

export class React_ref_innerHTML_xss extends Component {

    constructor() {
        super();
        this.nameRef = React.createRef();
        this.emailRef = React.createRef();
        this.websiteRef = React.createRef();

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
        const request = await fetch(`${window.location.origin}/react-xss`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, website: website })
        });
        const response = await request.json();
        this.nameRef.current.innerHTML = response.name;
        this.emailRef.current.innerHTML = response.email;
        this.websiteRef.current.setAttribute('href', response.website);
        this.websiteRef.current.innerHTML = response.website;
        document.getElementById('update').setAttribute('hidden', true);
        document.getElementById('updated').removeAttribute('hidden');
    }

    render() {
        return (
            <div>
                <br />
                <div className='container' >
                    <br />
                    <br/>
                    <h3>React ref-innerHTML XSS</h3><br/>
                    <p>
                        ReactJS provides escape hatch to provide direct access to DOM elements. With direct access
                        application can perform the desired operation, without requiring explicit support from React.
                        There are two escape hatches provided by ReactJS which give access to native DOM elements: <code>findDOMNode</code> and <code>createRef</code>. 
                        In this exercise application is using <a href="https://reactjs.org/docs/refs-and-the-dom.html"><code>refs</code></a> with <code>innerHTML</code> property to display user supplied input which makes it vulnerable to XSS.    
                        </p>
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
                                    Name:  <p ref={this.nameRef} style={{ display: "inline" }}></p><br />
                                    Email: <p ref={this.emailRef} style={{ display: "inline" }}></p><br />
                                    Website: <a ref={this.websiteRef} style={{ display: "inline" }}></a><br /><br />
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

export default React_ref_innerHTML_xss
