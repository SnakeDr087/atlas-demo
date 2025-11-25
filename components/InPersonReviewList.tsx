import React from 'react';
import type { InPersonReview } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './IconComponents';

interface InPersonReviewListProps {
    reviews: InPersonReview[];
    onEdit: (review: InPersonReview) => void;
    onDelete: (reviewId: string) => void;
}

const statusColors: { [key: string]: string } = {
    'Scheduled': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Canceled': 'bg-gray-100 text-gray-800',
};

const InPersonReviewList: React.FC<InPersonReviewListProps> = ({ reviews, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of in-person reviews with their details and available actions.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case #</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                        <tr key={review.id} className="hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">{review.caseNumber || 'N/A'}</th>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{review.officer.firstName} {review.officer.lastName}</div>
                                <div className="text-sm text-gray-500">{review.officer.badgeNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{review.reviewDate}</div>
                                <div className="text-sm text-gray-500">{review.reviewTime} at {review.reviewLocation}</div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[review.status] || ''}`}>
                                    {review.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onEdit(review)} aria-label={`View details for case ${review.caseNumber}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title={review.status === 'Scheduled' ? 'Complete Review' : 'View/Edit Details'}>
                                        {review.status === 'Scheduled' ? <PencilIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                    </button>
                                    <button onClick={() => onDelete(review.id)} aria-label={`Delete review for case ${review.caseNumber}`} className="text-gray-400 hover:text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InPersonReviewList;