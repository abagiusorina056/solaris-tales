import { toast } from "sonner";
import { uploadDocument, uploadImage, uploadPdf } from "./utils"

export const updateProfilImage = async (img, userId) => {
  const uploadedUrl = await uploadImage(img)

  const form = new FormData();
  form.append("image", uploadedUrl);

  const res = await fetch(`/api/user/${userId}/update-image-profile`, {
    method: "PATCH",
    body: form
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error)
  } else {
    toast.success("Poza de profil actualizata")
  }
}

export const updateProfile = async (userId, newData) => {
  const res = await fetch(`/api/user/${userId}/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newData
    }),
  });

  const data = await res.json();
  
  if (data.error) {
    toast.error(data.error)
  } else {
    toast.success("Profil actualizat")
  }
}

export const removeImage = async (image, userId) => {
  const res = await fetch(`/api/user/${userId}/remove-image`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image,
    }),
  })

  const data = await res.json();

  if (data.error) {
    toast.error(data.error)
  } 
  
  toast.success("Produs eliminat")
}

export const changeFavorite = async (bookId, userId, action) => {
  const res = await fetch(`/api/user/${userId}/favorite`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId,
      action,
    }),
  });

  const data = await res.json();
  return data;
}

export const bagItem = async (bookId, userId, action) => {
  const res = await fetch(`/api/user/${userId}/bag`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId,
      action,
    }),
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error)
  } else if (action === "delete") {
    toast.success("Produs eliminat")
  }
}

export const publishRequest = async (data, userId) => {
  // upload pdf first
  const uploadedUrl = await uploadPdf(data.bookFragments);

  const form = new FormData();

  form.append("userId", userId.toString());
  form.append("uploadedUrl", uploadedUrl);

  // send the rest of the data as json string
  form.append("data", JSON.stringify({
    phoneNumber: data.phoneNumber,
    title: data.title,
    description: data.description,
  }));

  const res = await fetch(`/api/user/${userId}/publish-request`, {
    method: "POST",
    body: form,
  });

  const result = await res.json();

  if (!res.ok) {
    toast.error(result.error || "Eroare");
    return;
  }

  toast.success("Cerere trimisă");
};

export const submitOrder = async (userId = "", orderData) => {
  const {
    shippingAdress,
    billingAdress,
    email,
    phone,
    products,
    name,
    paymentMethod,
    price,
    shippingMethod
  } = orderData
  
  const response = await fetch(`/api/checkout/${paymentMethod}`, {
    method: 'POST',
    body: JSON.stringify({ 
      products, 
      userId, 
      email, 
      name,
      shippingAdress,
      billingAdress,
      phone,
      price,
      shippingMethod
    }),
  });

  toast.success("Comanda procesata cu succes")

  const { url } = await response.json();
  window.location.href = url
}

export const markNotificationAsRead = async (notificationId, userId) => {
  const res = await fetch(`/api/user/${userId}/notification`, {
    method: 'PATCH',
    body: JSON.stringify({ 
      notificationId
    }),
  })

  const result = await res.json();

  if (!res.ok) {
    toast.error(result.error || "Eroare");
    return;
  }

  toast.success("Notificare marcata ca citita");
}

export const markMultipleNotificationsAsRead = async (userId) => {
  const res = await fetch(`/api/user/${userId}/notification/multiple`, {
    method: 'PATCH',
  })

  const result = await res.json();

  if (!res.ok) {
    toast.error(result.error || "Eroare");
    return;
  }

  toast.success("Notificariile au fost marcate ca citite");
}