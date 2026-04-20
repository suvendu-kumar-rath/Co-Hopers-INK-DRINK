import { useState } from 'react';
import './Printing.css';

const Printing = () => {
  const [printJob, setPrintJob] = useState({
    fileName: '',
    fileType: 'pdf',
    colorMode: 'blackwhite',
    paperSize: 'a4',
    orientation: 'portrait',
    copies: 1,
    doubleSided: false,
    userName: ''
  });

  const [printQueue, setPrintQueue] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const paperSizes = {
    a4: { name: 'A4', price: 2 },
    a3: { name: 'A3', price: 5 },
    letter: { name: 'Letter', price: 2 },
    legal: { name: 'Legal', price: 3 }
  };

  const colorPrices = {
    blackwhite: 2,
    color: 5
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrintJob(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPrintJob(prev => ({
        ...prev,
        fileName: file.name,
        fileType: file.type.includes('pdf') ? 'pdf' : 'document'
      }));
    }
  };

  const calculatePrice = () => {
    const basePrice = colorPrices[printJob.colorMode];
    const paperPrice = paperSizes[printJob.paperSize].price;
    const copies = parseInt(printJob.copies) || 1;
    return (basePrice + paperPrice) * copies;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!printJob.userName || !printJob.fileName) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    const newPrintJob = {
      ...printJob,
      id: Date.now(),
      status: 'queued',
      price: calculatePrice(),
      submittedAt: new Date().toLocaleString(),
      fileSize: selectedFile ? (selectedFile.size / 1024).toFixed(2) + ' KB' : 'N/A'
    };

    setPrintQueue([...printQueue, newPrintJob]);

    // Reset form
    setPrintJob({
      fileName: '',
      fileType: 'pdf',
      colorMode: 'blackwhite',
      paperSize: 'a4',
      orientation: 'portrait',
      copies: 1,
      doubleSided: false,
      userName: ''
    });
    setSelectedFile(null);
    document.getElementById('fileInput').value = '';

    alert('Print job submitted successfully! 🖨️');
  };

  const cancelPrintJob = (id) => {
    setPrintQueue(printQueue.filter(job => job.id !== id));
  };

  const updateJobStatus = (id, newStatus) => {
    setPrintQueue(printQueue.map(job => 
      job.id === id ? { ...job, status: newStatus } : job
    ));
  };

  return (
    <div className="printing">
      <h1>🖨️ Printing Service</h1>

      <div className="printing-container">
        <form onSubmit={handleSubmit} className="print-form">
          <h2>Submit Print Job</h2>

          <div className="form-group">
            <label htmlFor="userName">Your Name *</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={printJob.userName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fileInput">Select File *</label>
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              required
            />
            {selectedFile && (
              <p className="file-info">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="colorMode">Color Mode *</label>
            <select
              id="colorMode"
              name="colorMode"
              value={printJob.colorMode}
              onChange={handleInputChange}
              required
            >
              <option value="blackwhite">Black & White (₹2/page)</option>
              <option value="color">Color (₹5/page)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="paperSize">Paper Size *</label>
            <select
              id="paperSize"
              name="paperSize"
              value={printJob.paperSize}
              onChange={handleInputChange}
              required
            >
              {Object.entries(paperSizes).map(([key, { name, price }]) => (
                <option key={key} value={key}>
                  {name} (₹{price})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="orientation">Orientation</label>
            <select
              id="orientation"
              name="orientation"
              value={printJob.orientation}
              onChange={handleInputChange}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="copies">Number of Copies</label>
            <input
              type="number"
              id="copies"
              name="copies"
              min="1"
              max="100"
              value={printJob.copies}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="doubleSided"
                checked={printJob.doubleSided}
                onChange={handleInputChange}
              />
              <span>Double-Sided Printing</span>
            </label>
          </div>

          <div className="price-estimate">
            <strong>Estimated Price:</strong> ₹{calculatePrice()}
          </div>

          <button type="submit" className="submit-btn">
            Submit Print Job 🖨️
          </button>
        </form>

        <div className="print-queue">
          <h2>Print Queue</h2>
          {printQueue.length === 0 ? (
            <p className="no-jobs">No print jobs in queue</p>
          ) : (
            <div className="queue-list">
              {printQueue.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3>{job.userName}</h3>
                    <span className={`status-badge status-${job.status}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="job-details">
                    <p><strong>File:</strong> {job.fileName}</p>
                    <p><strong>Size:</strong> {job.fileSize}</p>
                    <p><strong>Color:</strong> {job.colorMode === 'blackwhite' ? 'B&W' : 'Color'}</p>
                    <p><strong>Paper:</strong> {paperSizes[job.paperSize].name}</p>
                    <p><strong>Orientation:</strong> {job.orientation}</p>
                    <p><strong>Copies:</strong> {job.copies}</p>
                    <p><strong>Double-Sided:</strong> {job.doubleSided ? 'Yes' : 'No'}</p>
                    <p className="price"><strong>Price:</strong> ₹{job.price}</p>
                    <p className="submitted-at">Submitted: {job.submittedAt}</p>
                  </div>
                  <div className="job-actions">
                    {job.status === 'queued' && (
                      <button 
                        onClick={() => updateJobStatus(job.id, 'printing')}
                        className="action-btn print-btn"
                      >
                        Start Printing
                      </button>
                    )}
                    {job.status === 'printing' && (
                      <button 
                        onClick={() => updateJobStatus(job.id, 'completed')}
                        className="action-btn complete-btn"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button 
                      onClick={() => cancelPrintJob(job.id)}
                      className="action-btn cancel-btn"
                    >
                      Cancel Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Printing;
