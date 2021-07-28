import Link from "next/link"
import React from "react"

interface DropdownProps {
  label: string
  items: Array<{key: string, label: string, href: string}>
}

const HoverDropdown: React.FunctionComponent<DropdownProps> = (props) => {
  const [open, setOpen] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState(false)

  const {label, items} = props

  return(
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div>
        <div
          className={`rounded-md px-3 text-xl cursor-default ${open ? "font-bold" : ""} `}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {label}
        </div>
      </div>
      <div
        className={`${!open && !openMenu ? "hidden " : ""}origin-top-right absolute pt-4 w-56 rounded-md focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        onMouseEnter={() => setOpenMenu(true)}
        onMouseLeave={() => setOpenMenu(false)}
      >
        <div className="py-1 bg-gray-100 dark:bg-gray-800" role="none">
          {
            items.map(({label, key, href}, idx) => 
              <Link href={href} key={key}>
                <a className="block px-4 py-2 text-md" role="menuitem" tabIndex={-1} id={`menu-item-${idx}`}>
                  {label}
                </a>
              </Link>
            )}
        </div>
      </div>
    </div>
  )
}

export default HoverDropdown
