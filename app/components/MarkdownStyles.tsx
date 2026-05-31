import React from 'react'

function classNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export const BlogContent: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({ className, ...props }) => (
  <div className={classNames('blog-content', className)} {...props} />
)

export const StyledH1: React.FC<React.ComponentPropsWithoutRef<'h1'>> = ({ className, ...props }) => (
  <h1 className={classNames('markdown-prose__h1', className)} {...props} />
)

export const StyledH2: React.FC<React.ComponentPropsWithoutRef<'h2'>> = ({ className, ...props }) => (
  <h2 className={classNames('markdown-prose__h2', className)} {...props} />
)

export const StyledH3: React.FC<React.ComponentPropsWithoutRef<'h3'>> = ({ className, ...props }) => (
  <h3 className={classNames('markdown-prose__h3', className)} {...props} />
)

export const StyledParagraph: React.FC<React.ComponentPropsWithoutRef<'p'>> = ({ className, ...props }) => (
  <p className={classNames('markdown-prose__paragraph', className)} {...props} />
)

export const StyledLink: React.FC<React.ComponentPropsWithoutRef<'a'>> = ({ className, ...props }) => (
  <a className={classNames('markdown-prose__link', className)} {...props} />
)

export const StyledUl: React.FC<React.ComponentPropsWithoutRef<'ul'>> = ({ className, ...props }) => (
  <ul className={classNames('markdown-prose__ul', className)} {...props} />
)

export const StyledOl: React.FC<React.ComponentPropsWithoutRef<'ol'>> = ({ className, ...props }) => (
  <ol className={classNames('markdown-prose__ol', className)} {...props} />
)

export const StyledLi: React.FC<React.ComponentPropsWithoutRef<'li'>> = ({ className, ...props }) => (
  <li className={classNames('markdown-prose__li', className)} {...props} />
)

export const StyledBlockquote: React.FC<React.ComponentPropsWithoutRef<'blockquote'>> = ({ className, ...props }) => (
  <blockquote className={classNames('markdown-prose__blockquote', className)} {...props} />
)

export const StyledHr: React.FC<React.ComponentPropsWithoutRef<'hr'>> = ({ className, ...props }) => (
  <hr className={classNames('markdown-prose__hr', className)} {...props} />
)

export const StyledInlineCode: React.FC<React.ComponentPropsWithoutRef<'code'>> = ({ className, ...props }) => (
  <code className={classNames('markdown-prose__inline-code', className)} {...props} />
)

export const StyledTable: React.FC<React.ComponentPropsWithoutRef<'table'>> = ({ className, ...props }) => (
  <table className={classNames('markdown-prose__table', className)} {...props} />
)

export const StyledThead: React.FC<React.ComponentPropsWithoutRef<'thead'>> = ({ className, ...props }) => (
  <thead className={classNames('markdown-prose__thead', className)} {...props} />
)

export const StyledTbody: React.FC<React.ComponentPropsWithoutRef<'tbody'>> = ({ className, ...props }) => (
  <tbody className={classNames('markdown-prose__tbody', className)} {...props} />
)

export const StyledTr: React.FC<React.ComponentPropsWithoutRef<'tr'>> = ({ className, ...props }) => (
  <tr className={classNames('markdown-prose__tr', className)} {...props} />
)

export const StyledTh: React.FC<React.ComponentPropsWithoutRef<'th'>> = ({ className, ...props }) => (
  <th className={classNames('markdown-prose__th', className)} {...props} />
)

export const StyledTd: React.FC<React.ComponentPropsWithoutRef<'td'>> = ({ className, ...props }) => (
  <td className={classNames('markdown-prose__td', className)} {...props} />
)
