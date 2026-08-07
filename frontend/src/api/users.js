import {apiRequest} from './client.js';

export function getAllUsers() {
    return apiRequest('/users/');
}

export function getCurrentUser() {
  return apiRequest("/users/me");
}
