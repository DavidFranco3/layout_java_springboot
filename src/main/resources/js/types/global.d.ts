import { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
        Pusher: any;
        Echo: any;
    }
}
