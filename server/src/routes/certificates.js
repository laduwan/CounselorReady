// COMPLETE CERTIFICATE SERVING SOLUTION
// =====================================

// 1. ADD THIS ROUTE TO /server/src/routes/certificates.js

import fetch from 'node-fetch'; // Make sure this is installed: npm install node-fetch

// Add this new route handler
const serveCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (certificate.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!certificate.fileUrl) {
      return res.status(404).json({ error: 'Certificate file not available' });
    }

    console.log(`Serving certificate: ${certificate.certificateNumber}`);

    // Fetch directly from Cloudinary (no signing needed for this approach)
    const response = await fetch(certificate.fileUrl);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Certificate file not accessible' });
    }

    const fileBuffer = await response.buffer();
    
    // Serve as PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${certificate.fileName || 'certificate.pdf'}"`,
      'Content-Length': fileBuffer.length
    });

    res.send(fileBuffer);

  } catch (error) {
    console.error('Certificate serving error:', error);
    res.status(500).json({ error: 'Failed to serve certificate' });
  }
};

// ADD THIS ROUTE (add this line to your certificates router):
// router.get('/:id/serve', authenticateToken, serveCertificate);


// 2. UPDATE FRONTEND - Replace the viewCertificate function in certificates.html

async function viewCertificate(certificateId, button) {
  try {
    const token = localStorage.getItem('token');
    
    // Show loading state
    const originalHTML = button.innerHTML;
    button.innerHTML = 'Loading...';
    button.disabled = true;
    
    // NEW APPROACH: Direct backend serving (no signed URLs)
    const certificateUrl = `${API_URL}/api/certificates/${certificateId}/serve`;
    
    // Open authenticated URL directly
    const newWindow = window.open('', '_blank');
    
    // Create authenticated request
    const response = await fetch(certificateUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      // Get the PDF blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Show PDF in the new window
      newWindow.location.href = url;
      
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else {
      newWindow.close();
      alert('Error accessing certificate');
    }
    
    // Restore button
    button.innerHTML = originalHTML;
    button.disabled = false;

  } catch (error) {
    console.error('Certificate access error:', error);
    alert('Failed to access certificate');
    
    button.innerHTML = originalHTML;
    button.disabled = false;
  }
}
