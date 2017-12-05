import React, { Component } from 'react';

class FormMail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isValid: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      email: e.target.value,
      isValid: true
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(this.state.email);
  }

  render() {
    return (
      <div>
        <div className="section section-features bg-primary text-light text-center" >
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12 col-sm-12">
                <div className="columns">
                  <div className="column col-8">
                    <h2 className="text-center">Ingresá tu Email</h2>
                    <div className="form-group">
                      <label className="form-label text-left" htmlFor="name">Email</label>
                      <input className="form-input" type="email" value={this.state.email} onChange={this.handleChange} placeholder="Correo Electrónico" />
                    </div>
                    <div className="column col-12 col-mx-auto">
                      <a
                        id="submit"
                        href="#"
                        className="btn btn-lg"
                        onClick={(e) => this.onSubmit(e)}
                        disabled={!this.state.isValid}>Enviar</a>
                    </div>
                  </div>
                  <div className="column col-4">
                    <img src={this.props.gif} width={320} height={240} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <img className="col-mx-auto my-2" src="/img/logo.png" alt="Cloud Experts" />
        </div>
      </div>
    );
  }

};

export default FormMail;