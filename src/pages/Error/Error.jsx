import React from 'react'
import notfound from '../../assets/images/undraw_Not_found_re_bh2e.png';
import '../../assets/scss/pages/Error.css';

function Error() {
  return (
        <div className='error-notfound'>
            <img src={notfound} />
            <div className='error-text'>Page Not Found</div>
        </div>
  )
}

export default Error