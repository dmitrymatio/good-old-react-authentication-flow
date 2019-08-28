import { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import request from '../../utils/request';
import auth from '../../utils/auth';

const ConnectPage = ({
  history: { push },
  location: { search },
  match: {
    params: { provider },
  },
}) => {
  const pushRef = useRef();
  pushRef.current = push;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestURL = `${process.env.REACT_APP_BACK_END_URL}/auth/${provider}/callback${search}`;
        const response = await request(requestURL, { method: 'GET' });

        auth.setToken(response.jwt, true);
        auth.setUserInfo(response.user, true);
        pushRef.current('/');
      } catch (err) {
        // TODO handle API errors
        console.log({ err });
      }
    };

    fetchData();
  }, [provider, search]);
};

ConnectPage.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }),
  match: PropTypes.shape({
    params: PropTypes.shape({ provider: PropTypes.string.isRequired }),
  }),
};

export default memo(ConnectPage);
