import React, {Component} from 'react';
import intl from "react-intl-universal";
import {
  NavLink
} from "react-router-dom";
import PropTypes from "prop-types";

export default class Nav extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.intl = intl;
  }

  render() {
    return (
      <ul className="asset-nav clearfix">
        <li>
          <NavLink activeClassName="active" to={(`/${this.props.url}/balance`)}>
            {this.intl.get("asset-balance")}
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to={(`/${this.props.url}/dashboard`)}>
            {this.intl.get("asset-records")}
          </NavLink>
        </li>
      </ul>
    );
  }
}
