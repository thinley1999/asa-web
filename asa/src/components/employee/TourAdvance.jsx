import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Car, Plane } from "lucide-react";
import InCountryTour from "../general/InCountryTour";
import OutCountryTour from "../general/OutCountryTour";

const TourAdvance = () => {
  const [activeTab, setActiveTab] = useState("incountrytour");

  return (
    <Card className="w-full p-4">
      <Tabs 
        defaultValue="incountrytour" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-14 mb-6">
          <TabsTrigger value="incountrytour" className="h-12 text-base gap-2">
            <Car className="h-5 w-5" />
            In Country Tour
          </TabsTrigger>
          <TabsTrigger value="excountrytour" className="h-12 text-base gap-2">
            <Plane className="h-5 w-5" />
            Ex Country Tour
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incountrytour" className="space-y-4">
          <InCountryTour />
        </TabsContent>

        <TabsContent value="excountrytour" className="space-y-4">
          <OutCountryTour setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TourAdvance;
