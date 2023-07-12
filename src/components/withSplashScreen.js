import React, { Component } from "react";
// import auth0Client from "../Auth";
import "../App.css";

function LoadingMessage() {
  return (
    <div className="splash-screen">
      <span
        style={{
          color: "greenyellow",
          fontFamily: "Oxanium",
          fontSize: "2rem",
        }}
      >
        Wait a moment while we load your app.
      </span>
      <br />
      <div className="loading-dot">
        <span class="upper">
          <div class="circle"></div>
          <div class="parallelogram3"></div>
          <div class="parallelogram4"></div>
          <div class="parallelogram2"></div>
          <div class="parallelogram3"></div>
          <div class="parallelogram1"></div>
          <div class="parallelogram2"></div>
        </span>
        <span class="lower">
          <div class="triangle-down"></div>
          <div class="triangle-down1"></div>
        </span>
      </div>
    </div>
  );
}

function withSplashScreen(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
      };
    }

    async componentDidMount() {
      try {
        // await auth0Client.loadSession();
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      } catch (err) {
        console.log(err);
        this.setState({
          loading: false,
        });
      }
    }

    render() {
      // while checking user session, show "loading" message
      if (this.state.loading) return LoadingMessage();

      // otherwise, show the desired route
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withSplashScreen;
