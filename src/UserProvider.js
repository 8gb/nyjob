import React, { Component, createContext } from "react";
import { auth } from "./firebase";

export const UserContext = createContext({ user: null });
class UserProvider extends Component {
  state = {
    user: 'loading'
  };

  componentDidMount = () => {
    auth.whenAuthStateChanged(userAuth => {
      // console.log(JSON.stringify(userAuth))
      this.setState({ user: userAuth});
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;
