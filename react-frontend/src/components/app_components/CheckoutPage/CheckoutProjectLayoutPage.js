import React from "react";
import ProjectLayout from "../../Layouts/ProjectLayout";
import { connect } from "react-redux";
import CheckoutPage from "./CheckoutPage";

const CheckoutProjectLayoutPage = (props) => {
  return (
    <ProjectLayout>
      <CheckoutPage />
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(CheckoutProjectLayoutPage);
