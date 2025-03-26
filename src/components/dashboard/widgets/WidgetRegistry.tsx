import React from 'react';
import { WidgetType } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Calendar, Activity, Bell, DollarSign, Megaphone, UserSearch, Info } from 'lucide-react';

// Import all widget components
import WeatherWidget from './WeatherWidget';
import TasksWidget from './TasksWidget';
import MaintenanceWidget from './MaintenanceWidget';
import DocumentsWidget from './DocumentsWidget';
import CIInsightsWidget from './CIInsightsWidget';

// Create more realistic placeholder widgets for components we haven't fully implemented yet
const PropertiesWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Building className="h-6 w-6 text-blue-600" />
        <h3 className="font-medium">Properties Overview</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Properties</span>
          <span className="font-medium">12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Units</span>
          <span className="font-medium">256</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Occupancy Rate</span>
          <span className="font-medium">92%</span>
        </div>
        {size !== 'small' && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Units Under Maintenance</span>
            <span className="font-medium">7</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const ResidentsWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-6 w-6 text-purple-600" />
        <h3 className="font-medium">Residents Summary</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Residents</span>
          <span className="font-medium">418</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Owner-Occupied</span>
          <span className="font-medium">65%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">New Residents (30d)</span>
          <span className="font-medium">12</span>
        </div>
        {size !== 'small' && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Board Members</span>
            <span className="font-medium">7</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const EventsWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-6 w-6 text-indigo-600" />
        <h3 className="font-medium">Upcoming Events</h3>
      </div>
      <ul className="space-y-3">
        <li className="border-l-2 border-indigo-500 pl-3">
          <p className="font-medium">Board Meeting</p>
          <p className="text-xs text-muted-foreground">Oct 15, 7:00 PM • Community Room</p>
        </li>
        <li className="border-l-2 border-green-500 pl-3">
          <p className="font-medium">Fall Community Cleanup</p>
          <p className="text-xs text-muted-foreground">Oct 22, 9:00 AM • Common Areas</p>
        </li>
        {size !== 'small' && (
          <li className="border-l-2 border-amber-500 pl-3">
            <p className="font-medium">Budget Review Session</p>
            <p className="text-xs text-muted-foreground">Oct 28, 6:30 PM • Virtual</p>
          </li>
        )}
      </ul>
    </CardContent>
  </Card>
);

const ActivityWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-6 w-6 text-red-600" />
        <h3 className="font-medium">Recent Activity</h3>
      </div>
      <ul className="space-y-3">
        <li className="text-sm">
          <span className="font-medium">Sarah Williams</span> submitted a maintenance request
          <p className="text-xs text-muted-foreground">10 minutes ago</p>
        </li>
        <li className="text-sm">
          <span className="font-medium">David Johnson</span> uploaded board meeting minutes
          <p className="text-xs text-muted-foreground">2 hours ago</p>
        </li>
        {size !== 'small' && (
          <li className="text-sm">
            <span className="font-medium">Maria Rodriguez</span> approved a payment
            <p className="text-xs text-muted-foreground">5 hours ago</p>
          </li>
        )}
        {size === 'large' && (
          <li className="text-sm">
            <span className="font-medium">Thomas Miller</span> updated community guidelines
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </li>
        )}
      </ul>
    </CardContent>
  </Card>
);

const NotificationsWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-6 w-6 text-amber-600" />
        <h3 className="font-medium">Notifications</h3>
      </div>
      <ul className="space-y-3">
        <li className="text-sm p-2 bg-amber-50 rounded-md border border-amber-200">
          <p className="font-medium">Urgent: Water Shutdown</p>
          <p className="text-xs">Scheduled maintenance - Oct 12, 9AM-1PM</p>
        </li>
        <li className="text-sm p-2 bg-blue-50 rounded-md border border-blue-200">
          <p className="font-medium">Reminder: Quarterly Dues</p>
          <p className="text-xs">Due by October 15th</p>
        </li>
        {size !== 'small' && (
          <li className="text-sm p-2 bg-green-50 rounded-md border border-green-200">
            <p className="font-medium">Pool Season Extended</p>
            <p className="text-xs">Open until October 31st</p>
          </li>
        )}
      </ul>
    </CardContent>
  </Card>
);

const FinancialsWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h3 className="font-medium">Financial Snapshot</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Operating Balance</span>
          <span className="font-medium">$124,500</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Reserve Balance</span>
          <span className="font-medium">$345,000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">YTD Income</span>
          <span className="font-medium">$287,450</span>
        </div>
        {size !== 'small' && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">YTD Expenses</span>
            <span className="font-medium">$176,325</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const CalendarWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h3 className="font-medium">October 2023</h3>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        <span className="text-xs font-medium">Su</span>
        <span className="text-xs font-medium">Mo</span>
        <span className="text-xs font-medium">Tu</span>
        <span className="text-xs font-medium">We</span>
        <span className="text-xs font-medium">Th</span>
        <span className="text-xs font-medium">Fr</span>
        <span className="text-xs font-medium">Sa</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {[...Array(31)].map((_, i) => {
          const isEvent = [5, 12, 15, 22, 28].includes(i + 1);
          return (
            <div 
              key={i} 
              className={`text-xs p-1 rounded-full ${
                isEvent ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

const AnnouncementsWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Megaphone className="h-6 w-6 text-amber-600" />
        <h3 className="font-medium">Community Announcements</h3>
      </div>
      <ul className="space-y-3">
        <li className="border-b pb-2">
          <p className="font-medium">New Parking Policy</p>
          <p className="text-xs text-muted-foreground">Effective Nov 1 - Visitor parking limited to 48 hours</p>
        </li>
        <li className="border-b pb-2">
          <p className="font-medium">Holiday Decoration Guidelines</p>
          <p className="text-xs text-muted-foreground">Please review updated rules for the upcoming season</p>
        </li>
        {size !== 'small' && (
          <li>
            <p className="font-medium">Community Garden Expansion</p>
            <p className="text-xs text-muted-foreground">Additional plots available for spring 2024</p>
          </li>
        )}
      </ul>
    </CardContent>
  </Card>
);

const DirectoryWidget = ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => (
  <Card className={`${cardClass}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <UserSearch className="h-6 w-6 text-indigo-600" />
        <h3 className="font-medium">Resident Directory</h3>
      </div>
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder="Search residents..."
          className="w-full border rounded-md px-3 py-1 text-sm"
        />
      </div>
      <ul className="space-y-2">
        <li className="text-sm flex justify-between">
          <span>Anderson, M.</span>
          <span className="text-muted-foreground">Unit 203</span>
        </li>
        <li className="text-sm flex justify-between">
          <span>Chen, L.</span>
          <span className="text-muted-foreground">Unit 117</span>
        </li>
        {size !== 'small' && (
          <li className="text-sm flex justify-between">
            <span>Johnson, R.</span>
            <span className="text-muted-foreground">Unit 312</span>
          </li>
        )}
        {size === 'large' && (
          <>
            <li className="text-sm flex justify-between">
              <span>Martinez, A.</span>
              <span className="text-muted-foreground">Unit 405</span>
            </li>
            <li className="text-sm flex justify-between">
              <span>Singh, P.</span>
              <span className="text-muted-foreground">Unit 221</span>
            </li>
          </>
        )}
      </ul>
    </CardContent>
  </Card>
);

// This will map widget types to their respective components
export const widgetComponents: Record<WidgetType, React.ComponentType<any>> = {
  'weather': WeatherWidget,
  'tasks': TasksWidget,
  'maintenance': MaintenanceWidget,
  'documents': DocumentsWidget,
  'properties': PropertiesWidget,
  'residents': ResidentsWidget,
  'events': EventsWidget,
  'activity': ActivityWidget,
  'notifications': NotificationsWidget,
  'financials': FinancialsWidget,
  'calendar': CalendarWidget,
  'announcements': AnnouncementsWidget,
  'directory': DirectoryWidget,
  'ci-insights': CIInsightsWidget,
};

interface DynamicWidgetProps {
  type: WidgetType;
  size?: 'small' | 'medium' | 'large';
  config?: Record<string, any>;
  cardClass?: string;
}

// A component that renders the appropriate widget based on the type
export const DynamicWidget = ({ type, size, config, cardClass = '' }: DynamicWidgetProps) => {
  // Switch based on widget type
  switch (type) {
    case 'weather':
      return <WeatherWidget size={size} config={config} cardClass={cardClass} />;
    case 'tasks':
      return <TasksWidget size={size} cardClass={cardClass} />;
    case 'maintenance':
      return <MaintenanceWidget size={size} cardClass={cardClass} />;
    case 'documents':
      return <DocumentsWidget size={size} cardClass={cardClass} />;
    case 'ci-insights':
      return <CIInsightsWidget size={size} cardClass={cardClass} />;
    default:
      return (
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>{type} Widget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Widget type: {type}</p>
            <p className="text-muted-foreground">Size: {size}</p>
          </CardContent>
        </Card>
      );
  }
};
