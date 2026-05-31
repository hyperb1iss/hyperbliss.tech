import React from 'react'

function classNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export const ProjectMarkdownContent: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({ className, ...props }) => (
  <div className={classNames('project-markdown', className)} {...props} />
)

export const ProjectH1: React.FC<React.ComponentPropsWithoutRef<'h1'>> = ({ className, ...props }) => (
  <h1 className={classNames('project-markdown__h1', className)} {...props} />
)

export const ProjectH2: React.FC<React.ComponentPropsWithoutRef<'h2'>> = ({ className, ...props }) => (
  <h2 className={classNames('project-markdown__h2', className)} {...props} />
)

export const ProjectH3: React.FC<React.ComponentPropsWithoutRef<'h3'>> = ({ className, ...props }) => (
  <h3 className={classNames('project-markdown__h3', className)} {...props} />
)

export const ProjectParagraph: React.FC<React.ComponentPropsWithoutRef<'p'>> = ({ className, ...props }) => (
  <p className={classNames('project-markdown__paragraph', className)} {...props} />
)

export const ProjectLink: React.FC<React.ComponentPropsWithoutRef<'a'>> = ({ className, ...props }) => (
  <a className={classNames('project-markdown__link', className)} {...props} />
)

export const ProjectBlockquote: React.FC<React.ComponentPropsWithoutRef<'blockquote'>> = ({ className, ...props }) => (
  <blockquote className={classNames('project-markdown__blockquote', className)} {...props} />
)

export const ProjectHr: React.FC<React.ComponentPropsWithoutRef<'hr'>> = ({ className, ...props }) => (
  <hr className={classNames('project-markdown__hr', className)} {...props} />
)

export const ProjectInlineCode: React.FC<React.ComponentPropsWithoutRef<'code'>> = ({ className, ...props }) => (
  <code className={classNames('project-markdown__inline-code', className)} {...props} />
)

export const ProjectTable: React.FC<React.ComponentPropsWithoutRef<'table'>> = ({ className, ...props }) => (
  <table className={classNames('project-markdown__table', className)} {...props} />
)

export const ProjectThead: React.FC<React.ComponentPropsWithoutRef<'thead'>> = ({ className, ...props }) => (
  <thead className={classNames('project-markdown__thead', className)} {...props} />
)

export const ProjectTbody: React.FC<React.ComponentPropsWithoutRef<'tbody'>> = ({ className, ...props }) => (
  <tbody className={classNames('project-markdown__tbody', className)} {...props} />
)

export const ProjectTr: React.FC<React.ComponentPropsWithoutRef<'tr'>> = ({ className, ...props }) => (
  <tr className={classNames('project-markdown__tr', className)} {...props} />
)

export const ProjectTh: React.FC<React.ComponentPropsWithoutRef<'th'>> = ({ className, ...props }) => (
  <th className={classNames('project-markdown__th', className)} {...props} />
)

export const ProjectTd: React.FC<React.ComponentPropsWithoutRef<'td'>> = ({ className, ...props }) => (
  <td className={classNames('project-markdown__td', className)} {...props} />
)

export const ProjectUl: React.FC<React.ComponentPropsWithoutRef<'ul'>> = ({ className, ...props }) => (
  <ul className={classNames('project-markdown__ul', className)} {...props} />
)

export const ProjectOl: React.FC<React.ComponentPropsWithoutRef<'ol'>> = ({ className, ...props }) => (
  <ol className={classNames('project-markdown__ol', className)} {...props} />
)

export const ProjectLi: React.FC<React.ComponentPropsWithoutRef<'li'>> = ({ className, ...props }) => (
  <li className={classNames('project-markdown__li', className)} {...props} />
)

export const ProjectImage: React.FC<React.ComponentPropsWithoutRef<'img'>> = ({ alt, className, ...props }) => (
  <img alt={alt ?? ''} className={classNames('project-markdown__image', className)} {...props} />
)
