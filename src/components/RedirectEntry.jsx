import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContext } from '../components/PageContext';

export const RedirectEntry = () => {
  const navigate = useNavigate();
  const { page } = useContext(PageContext);

  useEffect(() => {
    if (page == undefined || page == '') navigate('/entry');
  }, [page, navigate]);

  return null;
};
