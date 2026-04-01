import { toast } from "sonner";
import { uploadImage } from "./utils";

// constants
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// user
export const deleteUser = async (id) => {
  const res = await fetch(`/api/admin/delete/user/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const deleteMultipleUsers = async (ids) => {
  const res = await fetch(`/api/admin/delete/user/multiple`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const updateUser = async (id, userData, isAuthor) => {
  const res = await fetch(
    `/api/admin/${isAuthor ? 'authors' : 'users'}/${id}/update`, 
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }
  );

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

// author
export const deleteAuthor = async (id) => {
  const res = await fetch(`/api/admin/delete/author/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const createClassicAuthor = async (authorData) => {
  const { file, name, bio, isClassicAuthor } = authorData
  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("isClassicAuthor", `${isClassicAuthor}`);

  const res = await fetch(`/api/admin/add/author`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const createAuthor = async (authorData) => {
  const { userId, isClassicAuthor } = authorData
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("isClassicAuthor", isClassicAuthor);
  const res = await fetch(`/api/admin/add/author`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

// book
export const addBook = async (bookData, author) => {
  const uploadedUrl = await uploadImage(bookData.image);

  const res = await fetch(`/api/admin/add/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...bookData,
      image: uploadedUrl,
      author: author?.name,
      authorId: author?._id
    }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }

  toast.success("Carte adaugata cu success")
}

export const deleteBook = async (id) => {
  const res = await fetch(`/api/admin/delete/book/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const deleteMultipleBooks = async (ids) => {
  const res = await fetch(`/api/admin/delete/book/multiple`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const updateBook = async (id, bookData) => {
  const res = await fetch(`/api/admin/books/${id}/update`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

// review
export const deleteReview = async (id) => {
  const res = await fetch(`/api/admin/delete/review/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const deleteMultipleReviews = async (ids) => {
  const res = await fetch(`/api/admin/delete/review/multiple`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

// publish request
export const decideOnPublishRequest = async (requestId, newStatus) => {
  const res = await fetch(`/api/admin/requests/decide`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      requestId,
      newStatus
     }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const deleteManuscript = async (requestId, publicId) => {
  const res = await fetch(`/api/admin/delete/manuscript`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, publicId }),
  });

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

// order
export const updateOrder = async (orderId, newData) => {
  const res = await fetch(`/api/admin/orders/${orderId}/update`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newData }),
  })

  const data = await res.json();
  if (data.error) {
    toast.error(data.error)
  }
}

export const validateUpdateOrderForm = (formData) => {
  const hasEmpty = formData.some(field => !formData[field] || formData[field].trim() === "");

  if (hasEmpty) {
    toast.error("Completeaza toate campurile obligatorii");
    return false;
  }

  if (!emailRegex.test(formData.email)) {
    toast.error("Adresa de email nu este valida");
    return false;
  }

  const phoneValue = formData.phone.trim();
  const phoneRegex = /^(07\d{8}|7\d{8})$/;
  
  if (!phoneRegex.test(phoneValue)) {
    toast.error("Numar de telefon invalid");
    return false;
  }

  return true;
};