export function adaptAuthors(authors = []) {
  return authors.map(a => ({
    id: a._id,
    name: a.name,
    email: a?.user?.email || null,
    rating: a.rating ?? 0,
    createdAt: a.createdAt,
    profileImage: a.image || null,
  }))
}

export function adaptUsers(users = []) {
  return users.map(u => ({
    id: u._id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    dob: u?.dob || null,
    socials: {
      instagram: u?.instagram,
      facebook: u?.facebook
    },
    gender: u.gender,
    createdAt: u.createdAt,
    profileImage: u.profileImage || null,
  }))
}

export function adaptBooks(books = [], isAuthorActive) {
  return books.map(b => ({
    id: b._id,
    image: b.image,
    title: b.title,
    author: b.author,
    authorId: b.authorId,
    price: b.price,
    rating: b.starReviews?.length ?? 0,
    genre: b.genre,
    releaseDate: b.releaseDate,
    createdAt: b.createdAt,
    isAuthorActive: isAuthorActive
  }))
}

export function adaptPublishRequests(requests = []) {
  return requests.map(r => ({
    id: r._id,
    senderId: r.senderId,
    title: r.title,
    senderName: r.user.firstName + " " + r.user.lastName,
    senderImage: r.user?.profileImage,
    senderEmail: r.user.email,
    phoneNumber: r.phoneNumber,
    status: r.status || "pending",
    pdfDocument: r.pdfDocument,
    createdAt: r.createdAt,
  }))
}

export function adaptReviews(
  reviews = [], 
  isReviewerActive, 
  isBookActive
) {
  return reviews.map(r => ({
    id: r._id,
    reviewerId: r.reviewerId || null,
    reviewerName: r.user ? (r.user.firstName + " " + r.user.lastName) : "Anonim",
    reviewerImage: r?.user?.profileImage || null,
    bookId: r.bookId,
    bookTitle: r.book.title,
    bookImage: r.book.image,
    review: r.review,
    createdAt: r.createdAt,
    isReviewerActive: isReviewerActive,
    isBookActive: isBookActive
  }))
}

export function adaptOrders(orders = []) {
  return orders.map(o => ({
    id: o._id,
    slug: o.slug,
    senderId: o?.user._id,
    senderImage: o?.user.profileImage || "",
    senderName: o.user ? (o.user.firstName + " " + o.user.lastName) : "Anonim",
    name: o.name,
    email: o.email,
    phone: o.phone,
    shippingAdress: o.shippingAdress,
    status: o.status,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt
  }))
}