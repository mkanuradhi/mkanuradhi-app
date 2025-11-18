'use client';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DayPicker, Formatters, Labels } from 'react-day-picker';
import { Form as BootstrapForm, InputGroup, Button, Overlay, Popover } from 'react-bootstrap';
import 'react-day-picker/dist/style.css';
import './date-picker-popover.scss';

const baseTPath = 'components.DatePickerPopover';

export interface DatePickerPopoverProps {
  selected?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  clearLabel?: string;
  disabled?: boolean;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  fromYear?: number;
  toYear?: number;
}

const formatDate = (date?: Date | null) => {
  if (!date) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const DatePickerPopover: FC<DatePickerPopoverProps> = ({
  selected,
  onChange,
  placeholder,
  clearLabel,
  disabled = false,
  placement = 'auto',
  fromYear,
  toYear
}) => {
  const t = useTranslations(baseTPath);

  const [show, setShow] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const toggle = () => !disabled && setShow((prev) => !prev);
  const close = () => setShow(false);

  const placeholderText = placeholder || t('placeholder');
  const clearButtonLabel = clearLabel || t('clear');

  const startMonth = fromYear ? new Date(fromYear, 0) : new Date(new Date().getFullYear() - 20, 0);
  const endMonth = toYear ? new Date(toYear, 11) : new Date(new Date().getFullYear() + 1, 11);

  const handleClear = () => {
    onChange(undefined);
    close();
  };

  // Handle clicks outside to close the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (
        show &&
        targetRef.current &&
        !targetRef.current.contains(target) &&
        !document.querySelector('.datepicker-popover')?.contains(target)
      ) {
        close();
      }
    };

    if (show) {
      // Use setTimeout to avoid immediate closing when opening
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  // Get month and weekday names from translations
  const months = useMemo(() => [
    t('months.january'),
    t('months.february'),
    t('months.march'),
    t('months.april'),
    t('months.may'),
    t('months.june'),
    t('months.july'),
    t('months.august'),
    t('months.september'),
    t('months.october'),
    t('months.november'),
    t('months.december')
  ], [t]);

  const weekdays = useMemo(() => [
    t('weekdays.sunday'),
    t('weekdays.monday'),
    t('weekdays.tuesday'),
    t('weekdays.wednesday'),
    t('weekdays.thursday'),
    t('weekdays.friday'),
    t('weekdays.saturday')
  ], [t]);

  // Custom formatters
  const formatters: Partial<Formatters> = useMemo(() => ({
    formatWeekdayName: (date: Date) => weekdays[date.getDay()],
    formatMonthDropdown: (month: Date) => months[month.getMonth()]
  }), [months, weekdays]);

  // Custom labels
  const labels: Partial<Labels> = useMemo(() => ({
    labelMonthDropdown: () => t('monthDropdownLabel'),
    labelYearDropdown: () => t('yearDropdownLabel'),
  }), [t]);

  return (
    <>
      <InputGroup ref={targetRef}>
        <BootstrapForm.Control
          type="text"
          value={formatDate(selected)}
          readOnly
          placeholder={placeholderText}
          onClick={toggle}
          disabled={disabled}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        />
        <InputGroup.Text 
          role="button" 
          onClick={toggle}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <i className="bi bi-calendar2-check-fill"></i>
        </InputGroup.Text>
      </InputGroup>

      <Overlay
        target={targetRef.current}
        show={show}
        placement={placement}
        rootClose
        onHide={close}
        flip
        popperConfig={{
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8,
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'bottom', 'right', 'left'],
              },
            },
          ],
        }}
      >
        {(props) => (
          <Popover {...props} className="datepicker-popover">
            <Popover.Body>
              <DayPicker
                mode="single"
                selected={selected ?? undefined}
                defaultMonth={selected ?? new Date()}
                onSelect={(date) => {
                  onChange(date ?? undefined);
                  if (date) close();
                }}
                className="m-0"
                animate
                captionLayout="dropdown-years"
                fixedWeeks
                startMonth={startMonth}
                endMonth={endMonth}
                formatters={formatters}
                labels={labels}
              />
              {/* Clear button */}
              <div className="d-flex gap-2 justify-content-end mt-2 pt-2 border-top">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClear}
                >
                  {clearButtonLabel}
                </Button>
              </div>
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </>
  );
};

export default DatePickerPopover;