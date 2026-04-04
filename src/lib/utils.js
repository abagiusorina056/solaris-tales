import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";


// --- USER ---
  // constants
export const excludedRoutes = [
  '/login', 
  '/sign-up', 
  "/unsubscribe",
  "/succes"
];
export const orderStatusMap = {
  "processing" : "In Procesare",
  "shipped" : "Colet predat la curier",
  "delivered" : "Colet Livrat",
  "canceled" : "Comanda Anulata"
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(07\d{8}|7\d{8})$/;

  // utility functions
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + ' ...';
};

export function validateSignUpForm(formData, confirmPassword) {
  if (Object.values(formData).some(value => (value === "" || value === undefined))) {
    toast.error("Completeaza toate campurile obligatorii")
    return false
  }

  if (!emailRegex.test(formData.email)) {
    toast.error("Adresa de email nu este valida")
    return false
  }

  if (confirmPassword !== formData.password) {
    toast.error("Parolele nu se potrivesc")
    return false
  }

  return true
}

export const validateLoginForm = (formData) => {
  if (Object.values(formData).some(value => value === "")) {
    toast.error("Completeaza toate campurile obligatorii")
    return false
  }

  return true
}

export const validateAddBookForm = (formData) => {
  const { bookFragments, ...rest } = formData;
  const hasEmpty = Object.values(rest).some(value => value === "");

  if (hasEmpty) {
    toast.error("Completeaza toate campurile obligatorii")
    return false
  }

  return true
}

export const validatePublishForm = (formData) => {
  const hasEmpty = Object.values(formData).some(value => value === "" || value === false);

  if (hasEmpty) {
    toast.error("Completeaza toate campurile obligatorii")
    return false
  }

  return true
}

export const validateUpdateProfileForm = (formData) => {
  if (
    !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData?.firstName) || 
    !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData?.lastName)
  ) {
    toast.error("Numele poate contine doar litere sau caractere speciale (-, ')")
    return false
  }

  if (
    formData?.email && 
    (!emailRegex.test(formData?.email) || 
    formData?.email === "")
  ) {
    toast.error("Adresa de email nu este valida")
    return false
  }

  const phoneValue = formData.phoneNumber.trim();
  
  if (formData?.phoneNumber && !phoneRegex.test(phoneValue)) {
    toast.error("Numar de telefon invalid");
    return false;
  }

  return true
}

export const validateCreateAuthorForm = (file, name, bio) => {
  if ((!file && file.size === 0) || name === "" || bio === "") {
    toast.error("Completeaza toate campurile obligatorii")
    return false
  }

  return true
};

export const validateOrderForm = (formData) => {
  const requiredFields = ["name", "email", "phone", "shippingAdress"];
  const hasEmpty = requiredFields.some(field => !formData[field] || formData[field].trim() === "");

  if (hasEmpty) {
    toast.error("Completeaza toate campurile obligatorii");
    return false;
  }

  const nameRegex = /^[a-zA-Z\s\-șțăîâȘȚĂÎÂ']+$/;
  if (!nameRegex.test(formData.name)) {
    toast.error("Numele poate conține doar litere și caractere speciale (-, ')");
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

export const getCroppedImg = async (imageSrc, cropArea) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.src = url;
  });
}

export const uploadImage = async (img, isAdmin = false) => {
  const formData = new FormData();
  formData.append("file", img);

  const res = await fetch(`/api/${isAdmin ? "admin" : "user"}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.url;
};

export const uploadPdf = async (pdf) => {
  const formData = new FormData();
  formData.append("file", pdf);

  const res = await fetch("/api/pdf/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.url;
};

export const averageReview = (reviews) => {
  const roundToHalf = (num) => Math.round(num * 2) / 2;

  if (reviews === 0) return 0;

  const sum = reviews?.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.review),
    0,
  );

  const average = sum / reviews.length

  return roundToHalf(average)
}

export const calculateProcess = (allReviewsLength, reviewTotal) => (100 * reviewTotal) / allReviewsLength

export const buildPercentages = (allReviews) => {
  let percentages = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0
  }

  allReviews.forEach(r => {
    percentages[r.review.toString()] += 1
  });

  return percentages
}

export const groupBooksByAuthors = (books, authors) => {
  const map = new Map();

  for (const author of authors) {
    map.set(author._id, []);
  }

  for (const book of books) {
    if (!map.has(book.authorId)) {
      map.set(book?.authorId, []);
    }
    map.get(book?.authorId).push(book);
  }

  return map;
}

export const getCloudinaryPublicId = (profileImage) => {
  if (!(profileImage.length > 0)) return ""

  let lastSlash = profileImage.lastIndexOf("/")
  let lastPoint = profileImage.lastIndexOf(".")

  return profileImage.slice(lastSlash + 1, lastPoint)
}

export const getSelectedIds = (data, rowSelection) => {
  return data.filter(
    item => Object.keys(rowSelection).includes(item.id)
  )
}

export const getUser = async (id) => {
  const res = await fetch(
    `/api/me`,
    {
      credentials: "include",
    }
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.user
}

export const createOrder = async (sessionId) => {
  const response = await fetch("/api/order/confirm", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });

  const data = await response.json();

  return ({
    response,
    orderId: data.orderId
  })
};