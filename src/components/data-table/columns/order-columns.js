"use client";

import { 
  orderStatusMap, 
  truncateText 
} from "@src/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select"
import { IconLoader2 } from "@tabler/icons-react";
import { updateOrder } from "@src/lib/admin";
import { toast } from "sonner";

export function ordersColumns(handleDelete) {
  const handleStatusUpdate = async (e, orderId) => {
    updateOrder(orderId, { status: e })
      .then(() => {
        toast.success("Status actualizat cu succes")
        setIsStatusUpdating(false)
      })
  }

  return [
    {
      accessorKey: "slug",
      header: "ID",
      cell: ({ row }) => (
        <Link 
          href={`/admin/comanda/${row.original.id}`} 
          className="font-medium hover:underline!"
        >
          {row.original.slug}
        </Link>
      ),
    },
    {
      accessorKey: "senderName",
      header: "Utilizator",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.senderImage || defaultProfilePic}
            width={24}
            height={24}
            className="rounded-full"
            alt=""
          />
          <Link href={`/admin/user/${row.original.senderId}`}>
            <span className="hover:underline">
              {row.original.senderName}
            </span>
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nume",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <Link href={`mailto:${row.original.email}`}>
          <span className="hover:underline">{row.original.email}</span>
        </Link>),
    },
    {
      accessorKey: "phone",
      header: "Telefon",
      cell: ({ row }) => (
        <span>
          {
            row.original.phone[0] === "0" 
              ? "+4" +  row.original.phone 
              : "+40" + row.original.phone
          }
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Select
            disabled={row.original.status === "canceled" || isStatusUpdating} 
            onValueChange={(e) => handleStatusUpdate(e, row.original._id)}
          >
            <SelectTrigger className="w-full max-w-48">
              <IconLoader2 className="rotate" />
              <SelectValue placeholder={orderStatusMap[status]} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(orderStatusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Metoda de plata",
      cell: ({ row }) => <span className="capitalize">{row.original.paymentMethod}</span>,
    },
    {
      accessorKey: "shippingAdress",
      header: "Adresa",
      cell: ({ row }) => (
        <span>{truncateText(row.original.shippingAdress, 25)}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => (
        <span>{format(row.original.createdAt, "dd.MM.yyyy")}</span>
      ),
    },
  ];
}
