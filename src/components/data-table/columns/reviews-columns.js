"use client";

import { Button } from "@src/components/ui/button";
import { IconCircleDashed, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import defaultProfilePic from "@public/default-profile-pic.png"
import Image from "next/image";
import Link from "next/link";
import sorina from "@public/mockup-staff/sorina.png"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog"
import { deleteReview } from "@src/lib/admin";

export function reviewColumns(handleDelete) {
	return [
		{
			accessorKey: "review",
			header: "Review",
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<IconStarFilled color="#fdc700" size={16} />
					<span className="max-w-md truncate">{row.original.review}</span>
				</div>
			),
		},
		{
			accessorKey: "reviewerName",
			header: "Reviewer",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Image
						src={row.original.reviewerImage || defaultProfilePic}
						width={24}
						height={24}
						className="rounded-full"
						alt=""
					/>
					{row.original.isReviewerActive && row.original.reviewerId ? (
						<Link href={`/admin/utilizator/${row.original.reviewerId}`}>
							<span className="hover:underline">
								{row.original.reviewerName}
							</span>
						</Link>
					) : (
						<span>{row.original.reviewerName}</span>
					)}
				</div>
			)
		},
		{
			accessorKey: "bookTitle",
			header: "Carte",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Image
						src={row.original.bookImage || sorina}
						width={300}
						height={300}
						className="w-4 aspect-[1/1.5] object-cover object-center"
						alt=""
					/>
					{row.original.isBookActive ? (
						<Link
							href={`/admin/carte/${row.original.bookId}`}
						>
							<span className="hover:underline">
								{row.original.bookTitle}
							</span>
						</Link>
					) : (
						<span>{row.original.bookTitle}</span>
					)}
				</div>
			)
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
				<Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
							disabled={row.getIsSelected()}
              onClick={handleDelete}
            >
              <IconTrash color="#ff5252" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atentie</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <span>Urmeaza sa stergi urmatoarul utilizator:</span>
              <span className="flex items-center gap-3 mt-2">
                <IconCircleDashed width={"16"} height={"16"} />
								<span className="flex gap-1 items-center">
									<span className="max-w-md truncate">{row.original.review}</span>
									<IconStarFilled color="#fdc700" size={16} />
								</span>
                <span className="text-lg">•</span>
								<span className="flex items-center gap-2">
									<Image
										src={row.original.reviewerImage || defaultProfilePic}
										width={24}
										height={24}
										className="rounded-full"
										alt=""
									/>
									<span>
										{row.original.reviewerName}
									</span>
								</span>
                <span className="text-lg">•</span>
								<span className="flex items-center gap-2">
									<Image
										src={row.original.bookImage || sorina}
										width={300}
										height={300}
										className="w-4 aspect-[1/1.5] object-cover object-center"
										alt=""
									/>
									<span>
										{row.original.bookTitle}
									</span>
								</span>
              </span>
            </DialogDescription>
            <DialogFooter>
              <DialogClose className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"> 
                Anuleaza
              </DialogClose>
              <Button
								onClick={() => deleteReview(row.original.id)}
                className="cursor-pointer text-white rounded-sm px-4 py-1 bg-red-500 hover:bg-red-500 border-1"
              >
                Sterge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
			),
		},
	];
}
