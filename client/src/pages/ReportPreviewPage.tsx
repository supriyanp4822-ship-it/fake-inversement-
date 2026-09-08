import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ReportPreviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for the report based on FraudReportDetailsPage
  const reportData = {
    id: id || 'REP-2023-8472',
    date: '15-Oct-2023',
    companyName: 'Quantum Returns Ltd.',
    websiteUrl: 'www.quantumreturns-india.com',
    investorName: 'Nikhil Sharma (Claimed Manager)',
    investmentType: 'High-Yield Investment Program (HYIP)',
    amount: '₹2,50,000',
    expectedReturn: '45% Monthly (Unrealistic)',
    riskScore: 85,
    riskLevel: 'HIGH RISK',
    userDescription: "Promised 45% guaranteed monthly returns on a cryptocurrency fund. Claimed rapid growth. When I tried withdrawing small profits, they asked for a 'network processing fee' of ₹15,000 to release funds. Felt like a scam.",
    location: 'Mumbai, Maharashtra, India',
    indicators: [
      { type: 'Unrealistic Expected Returns', details: '45% Monthly is typical of Ponzi schemes.' },
      { type: 'Guaranteed Profit Claims', details: 'Investment guarantees with no risk detailed.' },
      { type: 'Suspicious Website', details: 'Domain registered 2 weeks ago, lacks SSL, WHOIS hidden.' },
      { type: 'Lack of Supporting Documentation', details: 'No legitimate SEBI registration or financial reports provided.' },
    ],
    status: 'Flagged for Investigation'
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsGenerating(true);
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Fraud_Report_${reportData.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:py-0 print:px-0">
      
      {/* Toolbar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span>←</span> Back to Report
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <span>🖨️</span> Print
          </button>
          <button 
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
               <span className="animate-pulse">Generating...</span>
            ) : (
              <><span>📄</span> Download PDF</>
            )}
          </button>
        </div>
      </div>

      {/* A4 Container (The printable area) */}
      <div className="max-w-4xl mx-auto flex justify-center">
        {/* We use a specific aspect ratio and width that resembles A4 paper */}
        <div 
          ref={reportRef}
          className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-10 print:shadow-none print:w-auto print:min-h-0 print:p-0 text-gray-800 relative"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Header */}
          <div className="border-b-2 border-blue-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-blue-900 mb-1 tracking-tight">FAKE INVESTMENT DETECTION</h1>
              <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">Automated Investigation Report</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-gray-800">{reportData.id}</p>
              <p className="text-sm text-gray-500">Generated: {reportData.date}</p>
            </div>
          </div>

          <div className="flex gap-8 mb-8">
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              {/* Investment Info */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Investment Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Company</span>
                    <span className="col-span-2 font-bold text-gray-900">{reportData.companyName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Website</span>
                    <span className="col-span-2 text-blue-700">{reportData.websiteUrl}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Contact</span>
                    <span className="col-span-2">{reportData.investorName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Type</span>
                    <span className="col-span-2">{reportData.investmentType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Amount</span>
                    <span className="col-span-2 font-semibold">{reportData.amount}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Promised Return</span>
                    <span className="col-span-2 text-red-600 font-semibold">{reportData.expectedReturn}</span>
                  </div>
                </div>
              </section>

              {/* User Description */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">User Description</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm italic leading-relaxed text-gray-700">
                  "{reportData.userDescription}"
                </div>
              </section>
            </div>

            {/* Right Column (Score & Indicators) */}
            <div className="w-1/3">
              {/* Score Box */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center mb-6">
                <p className="text-sm text-red-800 font-bold uppercase tracking-wider mb-2">Risk Assessment</p>
                <div className="text-5xl font-black text-red-600 mb-1">
                  {reportData.riskScore}<span className="text-2xl text-red-300">/100</span>
                </div>
                <div className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded text-sm mt-2">
                  {reportData.riskLevel}
                </div>
              </div>

              {/* Location Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Location</p>
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span>📍</span> {reportData.location}
                </p>
              </div>
            </div>
          </div>

          {/* Fraud Indicators List */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 text-red-800 flex items-center gap-2">
              <span>⚠️</span> Identified Fraud Indicators
            </h2>
            <div className="space-y-3">
              {reportData.indicators.map((indicator, index) => (
                <div key={index} className="flex gap-4 p-3 bg-red-50/50 rounded-lg border border-red-100">
                  <div className="text-red-500 font-bold mt-0.5">•</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{indicator.type}</h4>
                    <p className="text-sm text-gray-600 mt-1">{indicator.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Evidence List & Status */}
          <section className="mb-12">
            <div className="grid grid-cols-2 gap-8">
               <div>
                 <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Attached Evidence</h2>
                 <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                   <li>Screenshot_1.jpg (Website)</li>
                   <li>Screenshot_2.jpg (Chat logs)</li>
                   <li>Payment_Receipt.pdf</li>
                 </ul>
               </div>
               <div>
                 <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Report Status</h2>
                 <p className="text-sm font-bold text-orange-600 bg-orange-50 inline-block px-3 py-1 rounded border border-orange-200">
                   {reportData.status}
                 </p>
               </div>
            </div>
          </section>

          {/* Analysis Summary */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Analysis Summary & Recommendation</h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              Based on the automated assessment of the provided data, <strong>{reportData.companyName}</strong> exhibits multiple high-risk indicators strongly correlated with fraudulent investment schemes (Ponzi/HYIP structures). The combination of unrealistic guaranteed returns, lack of verifiable documentation, and suspicious domain patterns warrants extreme caution. 
              <br/><br/>
              <strong>Recommendation:</strong> Do not proceed with any financial transactions. Report this entity to local cybercrime authorities (e.g., I4C in India) and relevant financial regulators (e.g., SEBI).
            </p>
          </section>

          {/* Footer / Disclaimer */}
          <div className="absolute bottom-10 left-10 right-10 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-400 text-justify">
              <strong>DISCLAIMER:</strong> This document provides an automated risk assessment generated by the Fake Investment Detection system based on available heuristic data, algorithmic scoring, and user-provided reports. It is <strong>not</strong> an official government determination, a legal judgment, or financial advice. The risk score indicates the probability of fraudulent patterns but does not guarantee the malicious or benign nature of the entity. Please consult official regulatory authorities for binding verifications.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
