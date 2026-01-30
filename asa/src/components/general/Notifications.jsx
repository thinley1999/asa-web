import React, { useEffect, useState, useRef } from "react";
import cable from "../../cable";
import moment from "moment";
import {
  Bell,
  Check,
  X,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const Notifications = ({
  handleNotificationCount,
  closeNotification,
  showNotification,
}) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const toastRef = useRef(null);

  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "NotificationsChannel", token: token },
      {
        connected() {
          console.log("Connected to NotificationsChannel");
        },
        disconnected() {
          console.log("Disconnected from NotificationsChannel");
        },
        received(data) {
          if (
            !notifications.some((notification) => notification.id === data.id)
          ) {
            setNotifications((prevNotifications) => [
              data,
              ...prevNotifications,
            ]);
            handleNotificationCount((prevCount) => prevCount + 1);
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [token]);

  const formatDate = (date) => {
    const now = moment();
    const notificationDate = moment(date);
    if (now.isSame(notificationDate, "day")) {
      return "Today";
    }
    return notificationDate.format("MMM D, YYYY");
  };

  useEffect(() => {
    handleNotificationCount(notifications.length);
  }, [notifications, handleNotificationCount]);

  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    notifications.forEach((notification) => {
      const date = formatDate(notification.created_at);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  const markAllAsRead = () => {
    setNotifications([]);
    handleNotificationCount(0);
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    handleNotificationCount(Math.max(0, notifications.length - 1));
  };

  return (
    showNotification && (
      <Card className="w-96 shadow-xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeNotification}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {notifications.length > 0
              ? `${notifications.length} unread notifications`
              : "No new notifications"}
          </CardDescription>
        </CardHeader>
        <Separator />
        <ScrollArea className="h-[400px]">
          <CardContent className="p-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              Object.keys(groupedNotifications).map((date, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-center space-x-2 mb-3 px-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {date}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {groupedNotifications[date].map((notification, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={notification?.sender?.url}
                            alt="Sender"
                          />
                          <AvatarFallback>
                            {notification?.sender?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {moment(notification.created_at).fromNow()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {notification.detail_url && (
                                <a
                                  href={notification.detail_url}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  View
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => clearNotification(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={closeNotification}
              >
                Close notifications
              </Button>
            </div>
          </>
        )}
      </Card>
    )
  );
};

export default Notifications;