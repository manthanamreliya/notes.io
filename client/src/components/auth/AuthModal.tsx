import React from 'react';
import { AuthMode } from '../../types/auth.types';
import { Modal } from '../common/Modal';
import { AuthCard } from './AuthCard';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthCard key={initialMode} initialMode={initialMode} />
    </Modal>
  );
};
