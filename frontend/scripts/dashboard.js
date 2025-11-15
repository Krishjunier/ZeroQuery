document.addEventListener("DOMContentLoaded", () => {
    // For demonstration, we'll simulate a user role.
    // In practice, use your authentication system or token claims to determine the role.
    // For example, you might decode a JWT, then check the claim like: 
    //     const isAdmin = tokenData.is_admin;
    // Here, we'll simulate with a variable.
    
    // Simulate: set to true for admin view; false for regular user.
    const isAdmin = false; // Change to true if testing admin interface
  
    if (isAdmin) {
      document.getElementById("adminPanel").classList.remove("d-none");
    } else {
      document.getElementById("userPanel").classList.remove("d-none");
    }
  });
  