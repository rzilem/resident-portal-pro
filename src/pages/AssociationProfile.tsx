
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, Users, MapPin, CalendarDays, DollarSign, FileText, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAssociations } from '@/hooks/use-associations';
import { Association } from '@/types/association';
import PropertyListReport from '@/components/reports/property/PropertyListReport';
import { getPropertiesFromAssociations } from '@/components/properties/PropertyHelpers';

const AssociationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { associations } = useAssociations();
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (associations.length > 0 && id) {
      const foundAssociation = associations.find(a => a.id === id);
      setAssociation(foundAssociation || null);
      setLoading(false);
    }
  }, [associations, id]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading association details...</p>
        </div>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Association Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the association you're looking for.
          </p>
          <Button onClick={() => navigate('/properties')}>
            Return to Properties
          </Button>
        </div>
      </div>
    );
  }

  // Get properties associated with this association
  const properties = getPropertiesFromAssociations([association]);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building className="h-6 w-6" />
              {association.name}
            </h1>
            <p className="text-muted-foreground">ID: {association.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={association.status === 'active' ? 'secondary' : 'outline'}>
              {association.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            <Button variant="outline" onClick={() => navigate('/settings/associations')}>
              Edit Association
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 inline mr-1" /> Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">
                {association.address.street}<br />
                {association.address.city}, {association.address.state} {association.address.zipCode}<br />
                {association.address.country}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" /> Units
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{association.units}</div>
              <p className="text-muted-foreground">Total residential units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4 inline mr-1" /> Founded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {new Date(association.foundedDate).toLocaleDateString()}
              </div>
              <p className="text-muted-foreground">
                {new Date().getFullYear() - new Date(association.foundedDate).getFullYear()} years ago
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Association Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{association.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{association.contactInfo.phone}</span>
                    </div>
                    {association.contactInfo.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={association.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {association.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Association Type</h3>
                  <Badge variant="outline" className="capitalize">
                    {association.type}
                  </Badge>
                </div>

                {association.tags && association.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {association.tags.map((tag) => (
                          <Badge key={tag.id} variant="outline" className="bg-muted">
                            {tag.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Board Information</CardTitle>
              </CardHeader>
              <CardContent>
                {association.settings?.board ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Term Length:</span>
                      <span className="font-medium">{association.settings.board.termLength} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maximum Members:</span>
                      <span className="font-medium">{association.settings.board.maximumMembers}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No board information available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground text-sm mb-1">Fees Frequency</div>
                    <div className="font-medium capitalize">
                      {association.settings?.feesFrequency || 'Not set'}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground text-sm mb-1">Fiscal Year Start</div>
                    <div className="font-medium">
                      {association.settings?.fiscalYearStart ? 
                        new Date(`2000-${association.settings.fiscalYearStart}`).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 
                        'Not set'
                      }
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground text-sm mb-1">Currency</div>
                    <div className="font-medium">
                      {association.settings?.currencySymbol || '$'} ({association.settings?.currency || 'USD'})
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Payment Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Online Payments:</span>
                      <span className="font-medium">
                        {association.settings?.allowOnlinePayments ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Late Fee Type:</span>
                      <span className="font-medium capitalize">
                        {association.settings?.lateFeeType || 'Not set'}
                      </span>
                    </div>
                    {association.settings?.lateFeeAmount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Late Fee Amount:</span>
                        <span className="font-medium">
                          {association.settings?.currencySymbol || '$'}{association.settings.lateFeeAmount}
                          {association.settings?.lateFeeType === 'percentage' ? '%' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyListReport 
                  properties={properties}
                  timeRange="All Time"
                  association={association.name}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Module Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {association.settings?.modules ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(association.settings.modules).map(([module, enabled]) => (
                      <div key={module} className="flex items-center gap-2">
                        <Badge variant={enabled ? "secondary" : "outline"} className="w-20 justify-center">
                          {enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <span className="capitalize">{module}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No module settings available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {association.settings?.communications ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(association.settings.communications)
                        .filter(([key, _]) => typeof _ === 'boolean')
                        .map(([channel, enabled]) => (
                          <div key={channel} className="flex items-center gap-2">
                            <Badge variant={enabled ? "secondary" : "outline"} className="w-20 justify-center">
                              {enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                            <span className="capitalize">{channel.replace('Enabled', '')}</span>
                          </div>
                        ))}
                    </div>
                    
                    {association.settings.communications.defaultEmailSender && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Default Sender:</span>
                        <span className="font-medium">{association.settings.communications.defaultEmailSender}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No communication settings available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssociationProfile;
