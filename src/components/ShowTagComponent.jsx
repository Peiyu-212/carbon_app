import PropTypes from 'prop-types';
import React from 'react';
import { pageObject } from '../utils/Parameters';

const ShowTagComponent = ({ page }) => {
  return (
    <div>
      <p className="dynamic-title">
        <i className="fa-solid fa-location-crosshairs"></i> {pageObject[page]}
      </p>
    </div>
  );
};

ShowTagComponent.propTypes = {
  page: PropTypes.string,
};
export default ShowTagComponent;
