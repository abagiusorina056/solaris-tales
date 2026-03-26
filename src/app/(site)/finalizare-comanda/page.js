"use client"

import { Label } from '@src/components/ui/label'
import React from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@src/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@src/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@src/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@src/components/ui/radio-group"
import { IconArrowBarToRight, IconBuildingBank, IconCashBanknote, IconCheck, IconCopyPlusFilled, IconCreditCard, IconCubeSend, IconInfoCircle, IconMap2, IconPencil, IconSparkles2, IconStar } from '@tabler/icons-react'
import { Input } from '@src/components/ui/input'
import { Button } from '@src/components/ui/button'
import { useUser } from '@src/hooks/useUser'
import Image from 'next/image'
import { truncateText, validateOrderForm } from '@src/lib/utils'
import { Separator } from '@src/components/ui/separator'
import { Checkbox } from '@src/components/ui/checkbox'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { submitOrder } from '@src/lib/user'
import { PiShootingStar } from 'react-icons/pi'

const Checkout = () => {
  const { user } = useUser()
  let quantities = []
  user?.bagProducts.forEach(item => {
    quantities[item?.productId] = item?.quantity;
  })

  const inTotal = user?.bagBooks.reduce((sum, product) => {
    const quantity = quantities[product?._id] ?? 1;
    const price = Number(product?.price) || 0;
    
    return sum + price * quantity;
  }, 0);
  const defaultValues = {
    name: user?.firstName + " " + user?.lastName,
    email: user.email,
    phone: user?.phoneNumber || "",
    shippingPrice: 20,
    shippingAdress: "",
    billingAdress: "",
    shippingMethod: "courier",
    paymentMethod: "cash"
  }

  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState(defaultValues)
  const [editableData, setEditableData] = React.useState({
    name: false,
    email: false,
    phone: false
  })
  const [sameAdresses, setSameAdresses] = React.useState(false)
  const [finalPrice, setFinalPrice] = React.useState(inTotal)

  const handleFormChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRadioChange = (newValue, name) => setFormData(prev => ({
    ...prev,
    [name]: newValue
  }))

  const handleSubmitOrder = async () => {
    const isValid = validateOrderForm(formData)

    if (!isValid) {
      return
    }

    const products = user.bagBooks.map(book => ({
      title: book.title,
      price: parseFloat(book.price),
      bookId: book._id,
      quantity: quantities[book._id]
    }))

    setLoading(true)

    submitOrder(user._id, {
      ...formData,
      products,
      price: finalPrice
    })
  }

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      billingAdress: sameAdresses ? formData.shippingAdress : ""
    }))
  }, [formData.shippingAdress, sameAdresses])

  React.useEffect(() => {
    setFinalPrice(
      (formData.paymentMethod === "cash" ? inTotal + 20 : inTotal).toFixed(2)
    )
  }, [formData.paymentMethod, inTotal])

  return (
    <div className='w-full pt-16'>
      <div className='w-full px-16'>
        <div className='flex gap-16 w-full flex-nowrap overflow-x-auto scrollbar-hide pb-6'>
          {user.bagBooks.map((book, i) => (
            <div key={i} className='w-1/6 shrink-0'>
              <Image
                src={book?.image}
                width={200}
                height={200}
                className='w-full aspect-[1/1.5] object-cover object-center'
                alt={book?.title}
              />
              <p className='font-semibold text-xl'>{truncateText(book.title, 30)}</p>
              <div className='flex justify-between w-full text-lg'>
                <span>{book.price} RON</span>
                <span className='opacity-40'>x{quantities[book._id]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-start gap-4'>
          <div className='flex-1/2'>
            <h1 className='text-4xl mb-2'>
              Date de contact
            </h1>
            <div className='flex flex-col items-center gap-8'>
              <InputGroup className="py-6 bg-transparent placeholder:select-none">
                <InputGroupInput 
                  placeholder="Nume si prenume"
                  className="!text-xl"
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  readOnly={!editableData.name}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Edit"
                    title="Editeaza"
                    onClick={() => setEditableData(prev => ({
                      ...prev,
                      name: !prev.name
                    }))}
                    size="xl"
                  >
                    {editableData.name ? (
                      <IconCheck />
                    ) : (
                      <IconPencil />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              
              <InputGroup className="py-6 bg-transparent placeholder:select-none">
                <InputGroupInput 
                  placeholder="Email"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="!text-xl"
                  readOnly={!editableData.email} 
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Edit"
                    title="Editeaza"
                    onClick={() => setEditableData(prev => ({
                      ...prev,
                      email: !prev.email
                    }))}
                    size="xl"
                  >
                    {editableData.email ? (
                      <IconCheck />
                    ) : (
                      <IconPencil />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              <InputGroup className="py-6 bg-transparent placeholder:select-none">
                <InputGroupAddon align="inline-start" className={"border-r-1 pr-2 border-gray-400"}>
                  <Image
                    src={"/flag.jpeg"}
                    width={20}
                    height={20}
                    className="h-full w-auto rounded-sm"
                    alt='Romania'
                  />
                  <span className='text-xl'>+40</span>
                </InputGroupAddon>
                <InputGroupInput 
                  placeholder="Telefon"
                  type="number"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="!text-xl"
                  readOnly={!editableData.phone} 
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Edit"
                    title="Editeaza"
                    onClick={() => setEditableData(prev => ({
                      ...prev,
                      phone: !prev.phone
                    }))}
                    size="xl"
                  >
                    {editableData.phone ? (
                      <IconCheck />
                    ) : (
                      <IconPencil />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
          <Separator orientation="vertical" className={"bg-black"} />
          <div className='flex-1/2'>
            <h1 className='text-4xl mb-2'>
              Adresa
            </h1>
            <div className='flex flex-col items-center gap-8'>
              <InputGroup className="py-6 bg-transparent placeholder:select-none">
                <InputGroupInput 
                  placeholder="Adresa de livrare"
                  type="text"
                  name="shippingAdress"
                  id="shippingAdress"
                  value={formData.shippingAdress}
                  onChange={handleFormChange}
                  autoComplete="off"
                  className="!text-xl py-6 bg-transparent placeholder:select-none"
                />
                <InputGroupAddon align="inline-end">
                  {formData.shippingAdress && (
                    <InputGroupButton
                      aria-label="Edit"
                      title="Editeaza"
                      size="xl"
                    >
                      Adresa de livrare
                    </InputGroupButton>
                  )}
                </InputGroupAddon>
              </InputGroup>
              
              <div className='flex flex-col gap-2 w-full'>
                <InputGroup className="py-6 bg-transparent placeholder:select-none">
                  <InputGroupInput 
                    placeholder="Adresa de facturare"
                    type="text"
                    name="billingAdress"
                    id="billingAdress"
                    value={formData.billingAdress}
                    onChange={handleFormChange}
                    readOnly={sameAdresses}
                    autoComplete="off"
                    className="w-full !text-xl py-6 bg-transparent placeholder:select-none"
                  />
                  <InputGroupAddon align="inline-end">
                    {formData.billingAdress && (
                      <InputGroupButton
                        aria-label="Edit"
                        title="Editeaza"
                        size="xl"
                      >
                        Adresa de facturare
                      </InputGroupButton>
                    )}
                  </InputGroupAddon>
                </InputGroup>
                <Label className={"not-required text-xl"}>
                  <Checkbox checked={sameAdresses} onCheckedChange={setSameAdresses} />
                  <p>Aceeasi cu adresa de livrare</p>
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div> 
      <div className='w-full px-16 mt-8'>
        <h1 className='text-4xl mb-2'>
          Metoda de plata
        </h1>
        <RadioGroup 
          defaultValue={formData.paymentMethod}
          onValueChange={e => handleRadioChange(e, "paymentMethod")}
          className="w-full grid grid-cols-3 gap-8"
        >
          <FieldLabel 
            htmlFor="cash" 
            className="not-required col-span-1"
          >
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle className="flex items-center justify-between w-full text-2xl">
                  <span>Ramburs (numerar) la curier</span>
                  <IconCashBanknote size={40} className='opacity-40' />
                </FieldTitle>
                <FieldDescription className="text-xl">
                  Platesti cu numerar produsele cand ajunge curierul la adresa ta 
                  <Tooltip className='absolute ml-auto'>
                    <TooltipTrigger className="flex items-center gap-1 text-base text-gray-700">
                      <span>+20 RON</span>
                      <IconInfoCircle size={20} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pretul transportului este de 20 RON</p>
                    </TooltipContent>
                  </Tooltip>
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="cash" id="cash" />
            </Field>
          </FieldLabel>
          <FieldLabel 
            htmlFor="card" 
            className="not-required col-span-1"
          >
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle className="flex items-center justify-between w-full text-2xl">
                  <span>Online (cu cardul)</span>
                  <IconCreditCard size={40} className='opacity-40' />
                </FieldTitle>
                <FieldDescription className="text-xl">
                  Platesti comanda acum si iti livram produsele in cel mai scurt timp posibil 
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="card" id="card" />
            </Field>
          </FieldLabel>
        </RadioGroup>

        <Card className="mx-auto mt-8 w-full font-semibold">
          <CardHeader>
            <CardTitle className={"text-center text-2xl"}>Finalizeaza Comanda</CardTitle>
          </CardHeader>
          <CardContent className={"flex items-center"}>
            <div className='flex-1/2 border-black border-r-1 px-6'>
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-[var(--color-primary)]" >Nume:</h2>
                <span>{formData.name}</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-[var(--color-primary)]">Email:</h2>
                <span>{formData.email}</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-[var(--color-primary)]">Telefon:</h2>
                <span>
                  {
                    formData.phone ? (
                      formData.phone[0] === "0" 
                      ? "+4" +  formData.phone 
                      : "+40" + formData.phone
                    )  : "-"
                  }
                </span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-[var(--color-primary)]">Pret produse:</h2>
                <span>{inTotal} RON</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-[var(--color-primary)]">Adresa de livrare:</h2>
                <span>{formData.shippingAdress || "-"}</span>
              </div>
              <Separator className="my-1" />
              <div className='w-full flex items-baseline justify-between'>
                <h2 className="text-[var(--color-primary)]">Adresa de facturare:</h2>
                <span>{formData.billingAdress || "-"}</span>
              </div>

              <div className='flex items-center gap-6 my-4 text-center justify-center'>
                <span className='text-2xl'>Vei primi</span>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>{Math.floor(inTotal / 10)}</span>
                  <div className='p-1 bg-yellow-400 rounded-full'>
                    <IconStar size={24} className=' text-white' />
                  </div>
                </div>
              </div>
            </div>

            <Separator orientation='vertical' />

            <div className='flex items-center justify-center flex-col flex-1/2'>
              <h1 className='text-3xl uppercase'>Total:</h1>
              <span className='text-3xl mb-4 text-[var(--color-primary)]'>{finalPrice} RON</span>

              {formData.paymentMethod === "cash"
                ? (
                  <div className='flex items-center justify-center gap-2 w-fit rounded-full border-black border-2 text-xl px-4'>
                    <IconCashBanknote size={28} />
                    <span className="text-lg">•</span>
                    <span>Ramburs (cash)</span>
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2 w-fit rounded-full border-black border-2 text-xl px-4'>
                    <IconCreditCard size={28} />
                    <span className="text-lg">•</span>
                    <span>Online (card)</span>
                  </div>
                )
              }
            </div>
          </CardContent>
          
          <Separator />
          <CardFooter>
            <Button 
              variant="outline" 
              disabled={loading}
              onClick={handleSubmitOrder}
              className="w-1/2 mx-auto py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-xl hover:text-white cursor-pointer"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="rotate" />
              ) : (
                formData.paymentMethod === "cash" 
                  ? "Trimite Comanda" 
                  : "Plateste online"
              )}
              
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Checkout