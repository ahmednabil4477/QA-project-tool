import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'gallery.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'create-account.html'),
        flights: resolve(__dirname, 'flights.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        bookings: resolve(__dirname, 'my-bookings.html'),
        destination: resolve(__dirname, 'destination.html'),
        adminUsers: resolve(__dirname, 'admin-users.html'),
        adminBookings: resolve(__dirname, 'admin-bookings.html')
      }
    }
  }
});
