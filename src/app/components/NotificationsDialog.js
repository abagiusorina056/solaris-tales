import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@src/components/ui/card";
import { Badge } from '@src/components/ui/badge';
import { IconBell, IconBellX, IconChecks, IconLoader2 } from '@tabler/icons-react';
import { Label } from '@src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@src/components/ui/select';
import { Button } from '@src/components/ui/button';
import Link from 'next/link';
import { useUser } from '@src/hooks/useUser';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@src/lib/utils';
import defaultProfilPic from "@public/default-profile-pic.png";
import Image from 'next/image';
import { socket } from '@src/lib/socketClient';
import { markMultipleNotificationsAsRead, markNotificationAsRead } from '@src/lib/user';
import { useAdmin } from '@src/hooks/useAdmin';

const NotificationsDialog = ({ user, invalidate, isDashboard = false}) => {
  const isAdmin = user?.role === "admin"
  const [selectValue, setSelectValue] = React.useState("all")
  const [isMarkingOne, setIsMarkingOne] = React.useState(false)
  const [markingId, setMarkingId] = React.useState(null)
  const [isMarkingMultiple, setIsMarkingMultiple] = React.useState(false)

  const allNotifications = React.useMemo(() => user?.notifications || [], [user?.notifications])

  const filteredNotifications = React.useMemo(() => {
    if (selectValue === "all") return allNotifications

    return allNotifications.filter(n => n?.type === selectValue)
  }, [allNotifications, selectValue])

  const areNotificationsUnread = allNotifications.some(n => !n.isRead)

  const handleMarkSingle = (notificationId) => {
    setMarkingId(notificationId)
    setIsMarkingOne(true)
    
    markNotificationAsRead(notificationId, user._id)
    .then(() => {
        setIsMarkingOne(false)
        setMarkingId(null)
      })
  }

  const handleMarkMultiple = () => {
    setIsMarkingMultiple(true)

    markMultipleNotificationsAsRead(user._id)
      .then(() => setIsMarkingMultiple(false))
  }

  React.useEffect(() => {
    socket.on("notificationRead", () => {
      invalidate()
    })
    socket.on("notificationsRead", () => {
      invalidate()
    })

    return () => {
      socket.off("notificationRead")
      socket.off("notificationsRead")
    }
  }, [invalidate])

  return (
    <Dialog>
      <DialogTrigger disabled={user?.notifications?.length === 0}>
        <div className={cn(
          "relative",
          (isAdmin && isDashboard) && "mr-8",
          user?.notifications?.length === 0 && "cursor-not-allowed opacity-30"
        )}>
          {
            user?.notifications?.length === 0 ? (
              <IconLoader2 size={12} className='rotate absolute -right-1' />
            ) : (
              Boolean(areNotificationsUnread) && (
                <Badge
                  variant="default"
                  className="p-1 aspect-square! rounded-full top-1 right-1 select-none"
                />
              )
            )
          }
          <IconBell size={32} />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#f7f7f7]">
        <DialogHeader>
          <DialogTitle>Notificari</DialogTitle>
          <DialogDescription className="flex flex-col items-end">
            <section className="flex items-center gap-2 w-full">
              <Label htmlFor="type" className="not-required text-xl">
                Tip:
              </Label>
              <Select 
                defaultValue={selectValue} 
                onValueChange={setSelectValue}
                id="type"
                name="type"
                className="w-full"
              >
                <SelectTrigger
                  className="flex text-xl w-full @4xl/main:hidden"
                  id="view-selector"
                >
                  <SelectValue placeholder="Tipul notificariilor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xl">Toate</SelectItem>
                  <SelectItem value="request" className="text-xl">Cereri</SelectItem>
                  <SelectItem value="order" className="text-xl">Comenzi</SelectItem>
                  <SelectItem value="system" className="text-xl">Sistem</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={"ghost"}
                onClick={handleMarkMultiple}
                disabled={!Boolean(areNotificationsUnread) || isMarkingMultiple}
                className={cn(
                  "bg-gray-200 hover:bg-gray-200 text-black my-4 cursor-pointer transition-all duration-200",
                  !isDashboard && "text-[var(--color-primary)] hover:text-[var(--color-primary)] bg-[#E6C6A1] hover:bg-[#E6C6A1]"
                )}
              >
                {isMarkingMultiple ? (
                  <IconLoader2 className='rotate' />
                ) : (
                  <IconChecks />
                )}
                Marcheaza toate ca citite
              </Button>
            </section>

            <div className="w-full max-h-120 overflow-scroll">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n, i) => {
                  const date = new Date(n.createdAt);
                  const realtiveDate = formatDistanceToNow(date, { locale: ro });

                  return (
                    <Card 
                      key={i} 
                      className={cn(
                        "bg-transparent mb-2 py-2 gap-0.5 w-full", 
                        !n?.isRead && "border-3 border-black/40",
                        (!n?.isRead && !isDashboard) && "border-[var(--color-primary)]/40"
                      )}
                    >
                      <CardHeader className="px-4 flex items-baseline justify-between">
                        <CardTitle className={"text-lg font-normal"}>{n.subject}</CardTitle>
                        <span className="opacity-40">{realtiveDate}</span>
                      </CardHeader>
                      <CardContent className={""}>
                        {n.content}
                      </CardContent>
                      <CardFooter className={cn(
                          "mt-4 flex items-center justify-between",
                          !isAdmin && "justify-end"
                        )}
                      >
                        {isAdmin && (
                          <div className='flex items-center gap-2'>
                            <Image
                              src={n?.sender?.profileImage || defaultProfilPic}
                              width={30}
                              height={30}
                              alt=""
                              className='rounded-full'
                            />
                            <Link href={`/admin/utilizator/${n?.sender?._id}`}>
                              <span className='text-lg hover:underline'>
                                {n?.sender?.firstName + " " + n?.sender?.lastName}
                              </span>
                            </Link>
                          </div>
                        )}
                        <div className='flex items-center gap-2'>
                          {!n?.isRead && (
                            <Button
                              variant={"ghost"}
                              disabled={isMarkingOne && markingId === n?._id}
                              onClick={() => handleMarkSingle(n?._id)}
                              className={"bg-gray-200 hover:bg-gray-200 cursor-pointer transition-all duration-200"}
                            >
                              {isMarkingOne && markingId === n?._id ? (
                                <IconLoader2 className='rotate' />
                              ) : (
                                <IconChecks />
                              )}
                            </Button>
                          )}
                          <Button
                            variant={"ghost"}
                            onClick={() => {}}
                            className={cn(
                              "bg-black hover:bg-black text-white hover:text-white cursor-pointer transition-all duration-200",
                              !isDashboard && "text-[var(--color-primary)] hover:text-[var(--color-primary)] bg-[#E6C6A1] hover:bg-[#E6C6A1]"
                            )}
                          >
                            <Link href={n?.referenceLink} target="_blank">
                              Detalii
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })
              ) :(
                <div className="flex flex-col gap-4 w-full justify-center items-center py-4">
                  <IconBellX size={120} />
                  <span className="text-2xl">Nu exista notificari</span>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationsDialog