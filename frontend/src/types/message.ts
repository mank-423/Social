export interface messageStructure{
    _id: string; // MongoDB Id
    tempId?: string; // For optimistic UI
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    retryCount: number;
    error?: string;
    senderId: string,
    receiverId: string,
    text: string,
    image?: string,
    createdAt: string
}

export interface QueuedMessage{
    id: string;
    receiverId: string;
    text: string;
    image?: string;
    timestamp: number;
    retryCount: number;
}