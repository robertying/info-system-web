import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../helpers/auth";

function withAuth(AuthComponent) {
  return class AuthWrapped extends Component {
    render = () => {
      if (auth.isLoggedIn()) {
        return <AuthComponent.props.component {...this.props} />;
      } else {
        return <Redirect to="/login" />;
      }
    };
  };
}

export default withAuth;
