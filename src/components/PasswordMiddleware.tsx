import React, { useState, useEffect } from 'react';
import ConfirmAuth from './ConfirmAuth';
import { useAuthStore } from '@/store/auth';

export function withPasswordMiddleware<
	T extends React.ComponentPropsWithoutRef<any>
>(WrappedComponent: React.ComponentType<T>) {
	return function WrapperComponent(props: T) {
		const { localPassword } = useAuthStore();
		const index = { props };

		const [showAuthModal, setShowAuthModal] = useState(false);

		const handleSuccess = () => {
			setShowAuthModal(false);
		};
		const handleCloseModal = () => {
			setShowAuthModal(false);
			index.props.closeModal();
		};
		useEffect(() => {
			if (index.props.isOpen) {
				if (localPassword === null) {
					setShowAuthModal(true);
				}
			}
		}, [index.props.isOpen, localPassword]);

		return (
			<>
				<WrappedComponent {...props} />
				{showAuthModal && (
					<ConfirmAuth
						onSuccess={handleSuccess}
						open={showAuthModal}
						onExit={handleCloseModal}
					/>
				)}
			</>
		);
	};
}
