"use client"

import React, { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import { SectionCards } from "@src/components/section-cards";
import AuthorsTab from "@src/components/data-table/tabs/AuthorsTab";
import BooksTab from "@src/components/data-table/tabs/BooksTab";
import UsersTab from "@src/components/data-table/tabs/UsersTab";
import ReviewsTab from "@src/components/data-table/tabs/ReviewsTab";
import RequestsTab from "@src/components/data-table/tabs/RequestsTab";
import OrdersTab from "@src/components/data-table/tabs/OrdersTab";

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState("authors")
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					{/* <div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div> */}
					<Tabs
						defaultValue="authors"
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full flex-col justify-start gap-6  px-8"
					>
						<Select defaultValue="authors">
							<SelectTrigger
								className="flex w-fit @4xl/main:hidden"
								size="sm"
								id="view-selector"
							>
								<SelectValue placeholder="Select a view" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="authors">Autori</SelectItem>
								<SelectItem value="books">Carti</SelectItem>
								<SelectItem value="users">Utilizatori</SelectItem>
								<SelectItem value="reviews">Review-uri</SelectItem>
								<SelectItem value="requests">Cereri</SelectItem>
								<SelectItem value="orders">Comenzi</SelectItem>
							</SelectContent>
						</Select>
						<TabsContent
							value="authors"
							className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
						>
							<AuthorsTab>
								<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
									<TabsTrigger value="authors">Autori</TabsTrigger>
									<TabsTrigger value="books">Carti</TabsTrigger>
									<TabsTrigger value="users">Utilizatori</TabsTrigger>
									<TabsTrigger value="reviews">Review-uri</TabsTrigger>
									<TabsTrigger value="requests">Cereri</TabsTrigger>
									<TabsTrigger value="orders">Comenzi</TabsTrigger>
								</TabsList>
							</AuthorsTab>
						</TabsContent>
						<TabsContent
							value="books"
							className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
						>
							<BooksTab>
								<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
									<TabsTrigger value="authors">Autori</TabsTrigger>
									<TabsTrigger value="books">Carti</TabsTrigger>
									<TabsTrigger value="users">Utilizatori</TabsTrigger>
									<TabsTrigger value="reviews">Review-uri</TabsTrigger>
									<TabsTrigger value="requests">Cereri</TabsTrigger>
									<TabsTrigger value="orders">Comenzi</TabsTrigger>
								</TabsList>
							</BooksTab>
						</TabsContent>
						<TabsContent
							value="users"
							className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
						>
							<UsersTab>
								<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
									<TabsTrigger value="authors">Autori</TabsTrigger>
									<TabsTrigger value="books">Carti</TabsTrigger>
									<TabsTrigger value="users">Utilizatori</TabsTrigger>
									<TabsTrigger value="reviews">Review-uri</TabsTrigger>
									<TabsTrigger value="requests">Cereri</TabsTrigger>
									<TabsTrigger value="orders">Comenzi</TabsTrigger>
								</TabsList>
							</UsersTab>
						</TabsContent>
						<TabsContent
							value="reviews"
							className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
						>
							<ReviewsTab>
								<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
									<TabsTrigger value="authors">Autori</TabsTrigger>
									<TabsTrigger value="books">Carti</TabsTrigger>
									<TabsTrigger value="users">Utilizatori</TabsTrigger>
									<TabsTrigger value="reviews">Review-uri</TabsTrigger>
									<TabsTrigger value="requests">Cereri</TabsTrigger>
									<TabsTrigger value="orders">Comenzi</TabsTrigger>
								</TabsList>
							</ReviewsTab>
						</TabsContent>
						<TabsContent
							value="requests"
							className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
						>
							<RequestsTab>
								<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
									<TabsTrigger value="authors">Autori</TabsTrigger>
									<TabsTrigger value="books">Carti</TabsTrigger>
									<TabsTrigger value="users">Utilizatori</TabsTrigger>
									<TabsTrigger value="reviews">Review-uri</TabsTrigger>
									<TabsTrigger value="requests">Cereri</TabsTrigger>
									<TabsTrigger value="orders">Comenzi</TabsTrigger>
								</TabsList>
							</RequestsTab>
						</TabsContent>
						<TabsContent
							value="orders"
							className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
						>
							<OrdersTab>
								<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
									<TabsTrigger value="authors">Autori</TabsTrigger>
									<TabsTrigger value="books">Carti</TabsTrigger>
									<TabsTrigger value="users">Utilizatori</TabsTrigger>
									<TabsTrigger value="reviews">Review-uri</TabsTrigger>
									<TabsTrigger value="requests">Cereri</TabsTrigger>
									<TabsTrigger value="orders">Comenzi</TabsTrigger>
								</TabsList>
							</OrdersTab>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
