"use client";
import React, { ReactNode } from 'react';
import { Button, Modal } from 'react-bootstrap';


interface DeleteModalProps {
  title: string;
  description: ReactNode;
  cancelText: string;
  confirmText: string;
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({title, description, cancelText, confirmText, show, onHide, onConfirm}) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        role="dialog"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Modal.Header closeButton>
          <Modal.Title id="delete-modal-title">{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body id="delete-modal-description">
          { description }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} aria-label="Cancel deletion">
            { cancelText }
          </Button>
          <Button variant="danger" onClick={onConfirm} aria-label="Confirm deletion">
            { confirmText }
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal;