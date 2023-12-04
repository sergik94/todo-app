import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import cn from 'classnames';

import './Pagination.scss';
import { goTop } from '../../features/goTop';

export default function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currPage, setCurrPage] = useState(+(searchParams.get('page') || 1));
  const todos = useAppSelector((store) => store.todos);

  const changePageBy = (page: number) => {
    setSearchParams({ page: `${page}` });
    setCurrPage(page);
    goTop();
  };
  const pagesNumber = Math.ceil(todos.length / 20);

  const pages = [];

  for (let i = 1; i <= pagesNumber; i++) {
    pages.push(i);
  }

  return (
    <div className="todos__pagination pagination">
      <button
        className="pagination__button pagination__button--left button"
        disabled={currPage === 1}
        onClick={() => changePageBy(currPage - 1)}
      />
      <div className="pagination__buttons">
        {pages.map((page) => (
          <button
            key={page}
            className={cn('pagination__button', 'button', {
              'pagination__button--active': page === currPage,
            })}
            onClick={() => changePageBy(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="pagination__button pagination__button--right button"
        disabled={currPage === pagesNumber}
        onClick={() => changePageBy(currPage + 1)}
      />
    </div>
  );
}
