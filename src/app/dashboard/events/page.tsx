import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { AddEventButton } from "@/components/forms/AddEventButton";
import { EventCardActions } from "@/components/events/EventCardActions";

export default async function EventsPage() {
  const [events, classes] = await Promise.all([
    prisma.event.findMany({
      include: {
        class: true,
      },
      orderBy: { startTime: "asc" },
      take: 50,
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const upcomingEvents = events.filter(e => new Date(e.startTime) > new Date());
  const pastEvents = events.filter(e => new Date(e.startTime) <= new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-500 mt-1">View and manage school events</p>
        </div>
        <AddEventButton classes={classes} />
      </div>

      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 min-h-[3rem]">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {format(new Date(event.startTime), "MMMM dd, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      {format(new Date(event.startTime), "HH:mm")} - {format(new Date(event.endTime), "HH:mm")}
                    </div>
                    {event.class && (
                      <div className="mt-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100 font-medium">
                          {event.class.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <EventCardActions event={event} classes={classes} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-500">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75 grayscale-[0.5]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(event.startTime), "MMMM dd, yyyy")}
                    </div>
                    {event.class && (
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {event.class.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <EventCardActions event={event} classes={classes} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


