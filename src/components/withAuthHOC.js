import React, { Component } from "react";
import auth from "../helpers/auth";

const withAuth = (AuthComponent, allowedRoles) => {
  return class AuthWrapped extends Component {
    constructor(props) {
      super(props);

      this.state = {
        role: null
      };
    }

    // 未登录或登录失效则刷新页面，此时会回到 /login
    // 参见 withAuthRoute.js
    componentWillMount = () => {
      if (!auth.isLoggedIn()) {
        window.location.reload();
      } else {
        try {
          // 获得用户权限
          const role = auth.getRole();
          this.setState({ role: role });
        } catch (err) {
          auth.logout();
          window.location.reload();
        }
      }
    };

    render = () => {
      // 权限匹配则可以 render 对应的 component，否则返回空元素
      if (
        allowedRoles === undefined ||
        allowedRoles.includes(this.state.role)
      ) {
        return <AuthComponent {...this.props} />;
      } else {
        return null;
      }
    };
  };
};

export default withAuth;
