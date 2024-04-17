

export const Login = ()=> {
    return <section className="login-content">
    <div className="login-content-lt"></div>
    <div className="login-content-rt">
      <div className="login-box">
      <form className="login-form" action="#">
        <div className="logo-wrapper">
          <img src="src/assets/images/logo.svg" alt="Rishabh Software"/>
          <span>Meal Facility</span>
        </div>
        <h3 className="login-head">Sign in to your account</h3>
        <p className="login-text">Enter your credentials to access your account.</p>
        <div className="form-group">
          <label className="control-label">User Name</label>
          <div className="input-addon">
            <input className="form-control" type="text" placeholder="Robert Smith" autoFocus/>
          <div className="icon-after icon-green"><i className="icon-check"></i></div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label">Password</label>
          <div className="input-addon">
            <input id="password-field" className="form-control" type="password" value="Password"/>
            <span toggle="#password-field" className="icon-eye-close field-icon toggle-password"></span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div className="form-group mb-0">
          <label className="custom-checkbox mb-0"><span className="checkbox__title">Remember Me</span>
            <input className="checkbox__input" type="checkbox"/><span className="checkbox__checkmark"></span>
          </label>
        </div>
        <div className="form-group mb-0">
          <div className="utility">
            <p><a href="#" className="form-link">Forgot Password?</a></p>
          </div>
        </div>
        </div>
      
        <div className="form-group btn-container">
          <button className="btn btn-xl btn-primary">Sign in</button>
        </div>
      </form>
    </div>
    </div>
   
  </section>
}