import { useTranslations } from 'next-intl';
import React, { FC, ReactNode } from 'react';
import { Form as BootstrapForm, OverlayTrigger, Tooltip } from 'react-bootstrap';

const baseTPath = 'components.RequiredLabel';

interface RequiredFormLabelProps {
  required?: boolean;
  tooltip?: string;
  children: ReactNode;
}

const RequiredFormLabel: FC<RequiredFormLabelProps> = ({ required = true, tooltip, children }) => {
  const t = useTranslations(baseTPath);
  const langTooltip = tooltip || t('tooltip');

  return (
    <BootstrapForm.Label>
      { children }{' '}
      { required && (
          <OverlayTrigger 
            placement="top"
            overlay={<Tooltip id="required-tooltip">{langTooltip}</Tooltip>}
          >
            <span className="text-danger" style={{ cursor: 'help' }}>*</span>
          </OverlayTrigger>
        )
      }
    </BootstrapForm.Label>
  );
};

export default RequiredFormLabel;