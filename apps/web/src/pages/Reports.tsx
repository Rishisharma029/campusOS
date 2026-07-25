import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/Feedback';
import { useToast } from '../components/ui/Toast';
import { FileText, Download, CheckCircle, HelpCircle, Sparkles, Database, FileSpreadsheet } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const Reports: React.FC = () => {
  const toastContext = useToast();
  const toast = toastContext?.toast || ((t: string, m?: string) => console.log(t, m));
  const { students = [], feeCollections = [], books = [], placements = [] } = useDatabase() || {};

  const [reportType, setReportType] = useState('Admissions Summary');
  const [format, setFormat] = useState('CSV Flatfile');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportLog, setReportLog] = useState<{ id: string; name: string; format: string; date: string; content: string }[]>([
    {
      id: 'REP101',
      name: 'Admissions_Summary_Report_2026',
      format: 'CSV',
      date: new Date().toLocaleDateString(),
      content: 'RollNo,Name,Department,CGPA,Status\n2026CSE001,Rishi Sharma,Computer Science,9.4,Active\n2026CSE042,Ananya Roy,Computer Science,8.8,Active',
    },
  ]);

  const triggerBrowserDownload = (filename: string, textContent: string) => {
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const buildReportData = (type: string, fmt: string) => {
    let textData = '';
    const fileExt = fmt.includes('CSV') ? 'csv' : fmt.includes('Excel') ? 'xlsx' : 'txt';

    if (type === 'Admissions Summary' || type === 'Student Enrollment Roll') {
      textData = 'Student ID,Name,Roll Number,Department,CGPA,Placement Status,Fee Paid\n';
      students.forEach(s => {
        textData += `${s.id},${s.name},${s.rollNo},${s.department},${s.cgpa},${s.placementStatus},₹${s.feePaid}\n`;
      });
    } else if (type === 'Fee Collections Summary') {
      textData = 'Receipt ID,Student Name,Amount,Payment Method,Date\n';
      feeCollections.forEach(f => {
        textData += `${f.receiptNo},${f.studentName},₹${f.amountPaid},${f.paymentMethod},${f.paymentDate}\n`;
      });
    } else if (type === 'Library Book Issues') {
      textData = 'Book ID,Title,Author,Category,Available Copies,Total Copies\n';
      books.forEach(b => {
        textData += `${b.id},${b.title},${b.author},${b.category},${b.availableCopies},${b.totalCopies}\n`;
      });
    } else {
      textData = 'Placement ID,Company,Role,Package CTC,Eligible CGPA,Status\n';
      placements.forEach(p => {
        textData += `${p.id},${p.company},${p.role},${p.packageOffer},${p.eligibleCgpa},${p.status}\n`;
      });
    }

    return { textData, fileExt };
  };

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);

          const { textData, fileExt } = buildReportData(reportType, format);
          const cleanReportName = `${reportType.replace(/\s+/g, '_')}_Report_${Date.now()}`;
          const fullFilename = `${cleanReportName}.${fileExt}`;

          const newLogItem = {
            id: `REP${String(reportLog.length + 101)}`,
            name: cleanReportName,
            format: fileExt.toUpperCase(),
            date: new Date().toLocaleDateString(),
            content: textData,
          };

          setReportLog((prev) => [newLogItem, ...prev]);
          triggerBrowserDownload(fullFilename, textData);
          toast('Report Downloaded', `${reportType} compiled & downloaded as ${fullFilename}.`, 'success');
          return 100;
        }
        return p + 20;
      });
    }, 120);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 border-blue-500/40 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-950/40 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
              <Database size={22} className="text-blue-400" />
              Reports & Database Exports Engine
            </h1>
            <p className="text-xs text-slate-300">
              Compile structured analytical reports across admissions, fee ledgers, library issues, and placement drives.
            </p>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
            ADMIN EXPORT GATEWAY ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Controls */}
        <Card className="lg:col-span-1 border-slate-800">
          <CardHeader>
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                Report Builder Controls
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Configure export parameters</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Select
              label="Report Query Type"
              options={[
                { value: 'Admissions Summary', label: 'Admissions Summary & Roll' },
                { value: 'Fee Collections Summary', label: 'Fee Collections Ledger' },
                { value: 'Library Book Issues', label: 'Library Issue Logs' },
                { value: 'Student Enrollment Roll', label: 'Student Roll Call list' },
                { value: 'Placement Drives Summary', label: 'Placement Drives & CTC' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              disabled={generating}
            />

            <Select
              label="Output Format"
              options={[
                { value: 'CSV Flatfile', label: 'CSV Flatfile (.csv)' },
                { value: 'Excel Spreadsheet', label: 'Excel Spreadsheet (.xlsx)' },
                { value: 'PDF Document', label: 'PDF Text Report (.txt)' },
              ]}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={generating}
            />

            <Button
              className="w-full flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 shadow-lg shadow-blue-500/20"
              onClick={handleGenerate}
              isLoading={generating}
            >
              <FileSpreadsheet size={15} /> Compile & Download Report
            </Button>
          </CardContent>
        </Card>

        {/* Status display */}
        <Card className="lg:col-span-2 border-slate-800">
          <CardHeader>
            <div>
              <CardTitle className="text-sm font-bold text-white">Compilation Console & Downloaded History</CardTitle>
              <CardDescription className="text-xs text-slate-400">Live export compilation logs</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 justify-center h-full min-h-[220px]">
            {generating ? (
              <div className="flex flex-col gap-3.5 items-center justify-center text-center p-6 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-2">
                  <Database size={16} /> Assembling Database queries & compiling CSV/PDF...
                </span>
                <div className="w-full max-w-md">
                  <ProgressBar value={progress} color="bg-blue-600" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{progress}% Compiled</span>
              </div>
            ) : reportLog.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {reportLog.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3.5 border border-slate-800 rounded-xl bg-slate-950 hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{log.name}.{log.format.toLowerCase()}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Compiled ID: {log.id} &bull; {log.date}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 flex items-center gap-1.5 cursor-pointer text-xs font-bold border-slate-700 hover:bg-slate-800 text-slate-200"
                      onClick={() => {
                        triggerBrowserDownload(`${log.name}.${log.format.toLowerCase()}`, log.content);
                        toast('Download Triggered', `Downloading copy of ${log.name}...`, 'success');
                      }}
                    >
                      <Download size={13} /> Download Copy
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                <HelpCircle size={32} className="text-slate-600 mb-2" />
                <span className="text-xs font-bold text-slate-300">Ready to compile</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Select query parameters on the left panel to generate database exports.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
