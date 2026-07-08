import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/Feedback';
import { useToast } from '../components/ui/Toast';
import { FileText, Download, CheckCircle, HelpCircle } from 'lucide-react';

export const Reports: React.FC = () => {
  const { toast } = useToast();

  const [reportType, setReportType] = useState('Admissions Summary');
  const [format, setFormat] = useState('PDF Document');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportLog, setReportLog] = useState<{ id: string; name: string; format: string; date: string }[]>([]);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);
          const reportName = `${reportType.replace(/\s+/g, '_')}_Report_${Date.now()}`;
          setReportLog((prev) => [
            {
              id: `REP${String(prev.length + 101)}`,
              name: reportName,
              format: format.split(' ')[0],
              date: new Date().toLocaleDateString(),
            },
            ...prev,
          ]);
          toast('Report Downloaded', `${reportType} compiled successfully.`, 'success');
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Reports & Exports
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Generate structured analytical reports across finance registries, library stocks, and candidate enrollments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Report Builder</CardTitle>
              <CardDescription>Export parameters config</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Select
              label="Report Query Type"
              options={[
                { value: 'Admissions Summary', label: 'Admissions Summary' },
                { value: 'Fee Collections Summary', label: 'Fee Collections Ledger' },
                { value: 'Library Book Issues', label: 'Library Issue Logs' },
                { value: 'Student Enrollment Roll', label: 'Student Roll Call list' },
                { value: 'Academic Results sheet', label: 'Student Grades sheet' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              disabled={generating}
            />

            <Select
              label="Output Format"
              options={[
                { value: 'PDF Document', label: 'PDF Document (.pdf)' },
                { value: 'Excel Spreadsheet', label: 'Excel Spreadsheet (.xlsx)' },
                { value: 'CSV Flatfile', label: 'CSV Flatfile (.csv)' },
              ]}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={generating}
            />

            <Button
              className="w-full flex items-center justify-center gap-1.5 mt-2"
              onClick={handleGenerate}
              isLoading={generating}
            >
              <FileText size={14} /> Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Status display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Compilation status</CardTitle>
              <CardDescription>Export downloads console</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 justify-center h-full min-h-[160px]">
            {generating ? (
              <div className="flex flex-col gap-3.5 items-center justify-center text-center p-5">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">
                  Assembling Database queries...
                </span>
                <div className="w-full max-w-md">
                  <ProgressBar value={progress} color="bg-blue-600" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{progress}% compiled</span>
              </div>
            ) : reportLog.length > 0 ? (
              <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1">
                {reportLog.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl bg-surface hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-lg">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">{log.name}.{log.format.toLowerCase()}</h4>
                        <span className="text-[9px] text-slate-400 font-medium">Compiled ID: {log.id} • {log.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-2 flex items-center gap-1 cursor-pointer" onClick={() => toast('Download Re-triggered', 'Downloading report copy...', 'success')}>
                      <Download size={12} /> Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-405">
                <HelpCircle size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
                <span className="text-xs font-semibold">Ready to compile</span>
                <p className="text-[10px] text-slate-450 mt-0.5">Select filters on the left panel to request database downloads.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
