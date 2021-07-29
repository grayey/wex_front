import React, { Component } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { loginWithEmailAndPassword } from "app/redux/actions/LoginActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppMainService from "../../services/appMainService";
import localStorageService from "../../services/localStorageService";
import AppNotification from "../../appNotifications";
import * as utils from "@utils";
import { FaCog } from "react-icons/fa";
import "./sessions.css";

const SigninSchema = yup.object().shape({
  email: yup.string().required("username or email is required"),
  password: yup
    .string()
    .min(8, "Password must be 8 character long")
    .required("password is required"),
});

class Signin extends Component {
  appMainService;

  constructor(props) {
    super(props);
    this.appMainService = new AppMainService();
  }

  state = {
    email: "",
    password: "",
    navigate: false,
    isSubmitting: false,
    successUrl: "dashboard/v1",
  };

  handleChange = (event) => {
    event.persist();
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (value) => {
    let { isSubmitting } = this.state;
    isSubmitting = !isSubmitting;
    this.setState({ isSubmitting });
    const { email, password } = value;
    const loginObject = {
      username: email,
      email,
      password,
    };
    this.appMainService
      .logUserIn(loginObject)
      .then((userResponse) => {
        isSubmitting = !isSubmitting;
        this.setState({ isSubmitting });

        const notification = {
          type: "",
          message: "",
          timeOut: null,
        };

        if (userResponse.statusCode == 401) {
          notification.type = "error";
          notification.msg = userResponse.message;
          return new AppNotification(notification);
        }

        notification.type = "success";
        notification.msg = `Welcome ${userResponse.username}!`;
        notification.timeOut = 1000;
        localStorageService.setItem("AUTH_USER", userResponse);
        this.setState({ navigate: true });
        // this.props.loginWithEmailAndPassword(loginObject);
        console.log({ userResponse });

        return new AppNotification(notification);
      })
      .catch((error) => {
        this.setState({ isSubmitting });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
      });
  };

  isEmail = (text) => {
    const mailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return text.match(mailFormat);
  };

  render() {
    return this.state.navigate ? (
      <Redirect to={this.state.successUrl} />
    ) : (
      <div
        className="auth-layout-wrap"
        style={{
          // backgroundImage: "url(/assets/images/photo-wide-4.jpg)"
          backgroundColor: "transparent !important",
        }}
      >
        <div className="auth-content">
          <div className={`${this.props?.public ? "cardx" : "card"} o-hidden`}>
            <div className="row">
              <div className="col-md-6">
                <div className="p-4">
                  <div className="auth-logo text-center mb-4">
                    <img src="/assets/images/logo.png" alt="" />
                  </div>
                  {
                    !this.props.public && (
                      <h1 className="mb-3 text-18">Login</h1>

                    )
                  }
                  <Formik
                    initialValues={this.state}
                    validationSchema={SigninSchema}
                    onSubmit={this.handleSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="email">
                            Username <b>OR</b> Email
                          </label>
                          <input
                            className="form-control form-control-rounded position-relative"
                            type="text"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                          {errors.email && (
                            <div className="text-danger mt-1 ml-2">
                              {errors.email}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            className="form-control form-control-rounded"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                          {errors.password && (
                            <div className="text-danger mt-1 ml-2">
                              {errors.password}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-rounded btn-primary btn-block mt-2"
                          type="submit"
                          disabled={this.state.isSubmitting}
                        >
                          Sign In{" "}
                          {this.state.isSubmitting ? (
                            <FaCog className="fa-spin" />
                          ) : null}
                        </button>
                      </form>
                    )}
                  </Formik>

                  <div className="mt-3 text-center">
                    <Link to="/session/forgot-password" className="text-muted">
                      <u>Forgot Password?</u>
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className="col-md-6 text-center "
                style={{
                  backgroundSize: "cover",
                  backgroundImage: "url(/assets/images/photo-long-3.jpg)",
                }}
              >
                <div className="pr-3 auth-right">
                  <Link
                    to="/session/signup"
                    className="btn btn-rounded btn-outline-primary btn-outline-email btn-block btn-icon-text"
                  >
                    <i className="i-Mail-with-At-Sign"></i> Sign up with Email
                  </Link>

                  <Button className="btn btn-rounded btn-outline-google btn-block btn-icon-text">
                    <i className="i-Google-Plus"></i> Sign up with Google
                  </Button>
                  <Button className="btn btn-rounded btn-block btn-icon-text btn-outline-facebook">
                    <i className="i-Facebook-2"></i> Sign up with Facebook
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  user: state.user,
});

export default connect(mapStateToProps, {
  loginWithEmailAndPassword,
})(Signin);
