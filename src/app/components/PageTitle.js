import React from 'react'

const PageTitle = ({ title, children }) => {
  return (
    <div className='w-full flex items-center justify-between bg-[var(--color-primary)] text-white font-extrabold text-4xl py-8 px-10 tracking-wide uppercase rounded-sm'>
      <h1 className=''>
          {title}
      </h1>

      <div className='flex items-center gap-3'>
        {children}
      </div>
    </div>
  )
}

export default PageTitle