import React from 'react';
import { ClipLoader } from 'react-spinners';

type Props = {
    // Optional spinner size
    isLoading?: boolean;
}

const Spinner = ({ isLoading = true }: Props) => {
    return (
        <div className="flex justify-center items-center">
            <ClipLoader
                color={'#FFA500'} // Orange color
                loading={isLoading}
                aria-label='Loading spinner'
                data-testid='loading-spinner'
            />
        </div>
    );
}

export default Spinner;