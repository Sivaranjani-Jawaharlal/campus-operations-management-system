import { apiRequest } from "./client.js";

export async function signup({email, password, username}){
    return apiRequest("/auth/signup", {
        method: "POST",
        body: {email, password, username},
    });
}

export async function login({email, password}){
    return apiRequest("/auth/login", {
        method: "POST",
        body: {email, password},
    });
} 

export async function verify({email, verificationCode}){
    return apiRequest("/auth/verify", {
        method: "POST",
        body: {email, verificationCode},
    });
}

export async function resendVerificationCode(email){
    return apiRequest(`/auth/resend?email=${encodeURIComponent(email)}`, {
        method: "POST"
    });
}

export async function logout(){
    return apiRequest("/auth/logout", {
        method: "POST"
    });
}

export async function forgotPassword(email) {
  return apiRequest("/auth/forgot-password", { method: "POST", body: { email } });
}

export async function resetPassword({ token, newPassword }) {
  return apiRequest("/auth/reset-password", { method: "POST", body: { token, newPassword } });
}