import PropTypes from 'prop-types';
import React, { createContext, useState } from 'react';

export const PageContext = createContext({
  page: '', // 設定 page 的默認值
  tag: '',
  resultPage: '',
  setPage: () => {}, // setPage 默認是一個空函數
  setTag: () => {},
  setResultPage: () => {},
});

export const PageProvider = ({ children }) => {
  const [page, setPage] = useState('');
  const [tag, setTag] = useState('');
  const [resultPage, setResultPage] = useState('');

  return (
    <PageContext.Provider
      value={{
        page,
        setPage,
        tag,
        setTag,
        resultPage: resultPage,
        setResultPage: setResultPage,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

PageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
