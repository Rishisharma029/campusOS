import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Home, User, Phone, Coffee } from 'lucide-react';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';

export const Hostel: React.FC = () => {
  const roomData = [
    { block: 'Block A (Boys)', warden: 'Mr. Satish Kumar', contact: '+91 94455 12345', capacity: 120, occupied: 104 },
    { block: 'Block B (Boys)', warden: 'Mr. Sandeep Patil', contact: '+91 94455 67890', capacity: 100, occupied: 82 },
    { block: 'Block C (Girls)', warden: 'Mrs. Sunita Deshpande', contact: '+91 94455 54321', capacity: 150, occupied: 126 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Hostel Residence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor campus residential halls, allocations, mess schedule boards, and room warden contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warden details / Blocks info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {roomData.map((d) => (
            <Card key={d.block} hoverable>
              <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex gap-3 items-start text-xs">
                  <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl shrink-0">
                    <Home size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{d.block}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <User size={12} /> Warden: {d.warden}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Phone size={12} /> Contact: {d.contact}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {d.occupied} / {d.capacity} Rooms occupied
                  </span>
                  <div className="w-32 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(d.occupied / d.capacity) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {(((d.occupied / d.capacity) * 100)).toFixed(0)}% occupancy rate
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mess and Rules panels */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Mess Dining Board</CardTitle>
                <CardDescription>Today's menu slots</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="breakfast">
                <TabList className="px-5">
                  <TabTrigger value="breakfast">Breakfast</TabTrigger>
                  <TabTrigger value="lunch">Lunch</TabTrigger>
                  <TabTrigger value="dinner">Dinner</TabTrigger>
                </TabList>
                <TabContent value="breakfast" className="p-5 flex gap-3 text-xs">
                  <Coffee size={16} className="text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-205">Idli, Vada, Chutney & Tea</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Slots: 07:30 AM - 09:00 AM</span>
                  </div>
                </TabContent>
                <TabContent value="lunch" className="p-5 flex gap-3 text-xs">
                  <Coffee size={16} className="text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-205">Rice, Dal, Mixed Veg, Curd</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Slots: 12:30 PM - 02:00 PM</span>
                  </div>
                </TabContent>
                <TabContent value="dinner" className="p-5 flex gap-3 text-xs">
                  <Coffee size={16} className="text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-205">Paneer Masala, Chapati, Kheer</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Slots: 07:30 PM - 09:00 PM</span>
                  </div>
                </TabContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
