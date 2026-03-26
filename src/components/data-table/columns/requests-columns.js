"use client";

import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { createAuthor, decideOnPublishRequest } from "@src/lib/admin";
import { cn } from "@src/lib/utils";
import { IconFileTypePdf, IconCheck, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export function requestColumns(handleDelete) {
	return [
		{
			accessorKey: "title",
			header: "Titlu",
			cell: ({ row }) => (
				<span className="font-medium">{row.original.title}</span>
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
			accessorKey: "senderEmail",
			header: "Email",
			cell: ({ row }) => (
				<Link href={`mailto:${row.original.senderEmail}`}>
					<span className="hover:underline">{row.original.senderEmail}</span>
				</Link>),
		},
		{
			accessorKey: "phoneNumber",
			header: "Telefon",
			cell: ({ row }) => <span>{row.original.phoneNumber}</span>,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.original.status || "pending";

				return (
					<Button
						className={cn("font-semibold capitalize w-full",
							status === "approved"
								? "bg-green-400 hover:bg-green-400 text-white"
								: status === "rejected"
								? "bg-red-400 hover:bg-red-400 text-white"
								: ""
							)}
					>
						{status === "pending"
							? "In asteptare"
							: (status === "approved" ? "Aprobat" : "Respins")
						}
					</Button>
				);
			},
		},
		{
			accessorKey: "pdfDocument",
			header: "PDF",
			cell: ({ row }) =>
				row.original.pdfDocument ? (
					<Button variant="ghost">
						<Link
							href={`https://docs.google.com/gview?url=${row.original.pdfDocument}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-primary hover:underline"
						>
							<IconFileTypePdf size={18} />
							Vezi PDF
						</Link>
					</Button>
				) : (
					"—"
				),
		},
		{
			accessorKey: "createdAt",
			header: "Creat la",
			cell: ({ row }) => (
				<span>{format(row.original.createdAt, "dd.MM.yyyy")}</span>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<div className="flex gap-2">
					<Button 
						variant="ghost" 
						size="icon"
						className={cn(["rejected", "approved"].includes(row.original.status) && "hidden")}
						onClick={() => 
							decideOnPublishRequest(row.original.id, "approved")
							.then(() => createAuthor({
								userId: row.original.senderId,
								isClassicAuthor: false
							}))
						}
					>
						<IconCheck className="text-green-500" size={18} />
					</Button>
					<Button 
						variant="ghost" 
						size="icon"
						className={cn((["rejected", "approved"].includes(row.original.status)) && "hidden")}
						onClick={() => decideOnPublishRequest(row.original.id, "rejected")}
					>
						<IconX className="text-red-500" size={18} />
					</Button>
				</div>
			),
		},
	];
}
