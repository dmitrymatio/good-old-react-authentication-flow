/**
 *
 * SocialLink
 *
 */

import React from 'react';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { Button} from 'buffetjs';


function SocialLink({ provider }) {
  const styles = {
    facebook: {

    },
    github: {
      background: '#000',
      color: 'white'
    },
    google: {
      border: '1px solid #d6d9dc',
      color: '#535a60'
    },
    twitter: {
      background:  '#00aced',
      color: '#fff'
    }
  };

  return (
    <a href={`http://localhost:1337/connect/${provider}`} style={{ marginBottom: 15 }}>
      <Button type="button" social={provider} style={{ width: '100%', ...styles[provider] }}>
        <i className={`fab fa-${provider}`} style={{ marginRight: '10px' }} />
        {capitalize(provider)}
      </Button>
    </a>
  );
}

SocialLink.propTypes = {
  provider: PropTypes.string.isRequired,
};

export default SocialLink;
