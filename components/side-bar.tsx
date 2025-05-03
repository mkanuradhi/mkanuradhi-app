"use client";
import React from 'react';
import { useSideBar } from '@/hooks/use-side-bar';
import { Link } from '@/i18n/routing';
import { ListGroup } from 'react-bootstrap';
import { usePathname } from '@/i18n/routing';

const SideBar = () => {
  const { sidebarLinks } = useSideBar();
  const pathname = usePathname();

  return (
    <>
      <div>
        <ListGroup variant="flush">
          {sidebarLinks.map((sidebarLink, id) => (
            <ListGroup.Item
              key={id}
              action
              as={Link}
              href={sidebarLink.path}
              active={pathname.endsWith(sidebarLink.path)}
            >
              {sidebarLink.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
};

export default SideBar;
