import { ApiError } from '@/errors/api-error';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

interface ApiErrorAlertProps {
  error: unknown;
  message: string; // generic message
}

const ApiErrorAlert = ({ error, message}: ApiErrorAlertProps) => {

  return (
    <>
      <Row>
        <Col>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100svh - 4.5rem - 4.5rem - 15rem)' }}>
            <h5 className="my-3 text-center">{message}</h5>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ height: '72px' }} className="my-3" />
            <p>{error instanceof ApiError ? (error.message) : ('Error occurred')}</p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ApiErrorAlert;