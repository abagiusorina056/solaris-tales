import React from 'react'
import sorina from "@public/mockup-staff/sorina.png"
import andreea from "@public/mockup-staff/andreea.png"
import Image from 'next/image'
import Link from 'next/link';
import { BsEnvelope } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa6";
import { LuFacebook } from "react-icons/lu";
import { BsFeather } from "react-icons/bs";
import { PiPaintBrushLight } from "react-icons/pi";
import { cn } from '@src/lib/utils';
import PageTitle from '@src/app/components/PageTitle';

const staffMembers = [
    {
        firstName: "Denisa-Sorina",
        lastName: "Abagiu",
        role: "Scriitor",
        roleIcon: <BsFeather />,
        description: "Sorina este scriitoare pasionată și fondatoarea SolarisTales S.R.L., o editură creată pentru a oferi oportunități autorilor debutanți. Cu un început dificil în lumea editorială, Sorina a transformat provocările personale în motivație, dorind să deschidă porțile literaturii către orice scriitor care visează să fie citit.",
        signature: "Sorina",
        socials: {
            email: "sorina@gmail.com",
            instagram: "sorina",
            facebook: "Sorina"
        },
        image: sorina
    },
    {
        firstName: "Andreea-Florentina",
        lastName: "Csatlos-Musan",
        role: "Designer Grafic",
        roleIcon: <PiPaintBrushLight />,
        description: "Andreea este designerul grafic al echipei Solaris Tales, pasionată de vizual, culoare și estetica povestirilor bine spuse. Îmbină creativitatea cu atenția la detalii, transformând ideile în imagini care transmit emoție și personalitate. Fiecare proiect la care lucrează reflectă stilul ei sensibil, dar totodată modern, surprinzând atmosfera și mesajul din spatele fiecărei povești.",
        signature: "Andreea",
        socials: {
            email: "andreea@gmail.com",
            instagram: "andreea",
            facebook: "Andreea"
        },
        image: andreea
    },
]

const AboutUs = () => {
  return (
    <>
        <PageTitle title="Povestea noastra" />
        <p className='px-8 text-xl w-full font-semibold mt-10'>
            Într-o lume în care cuvintele căutau să prindă glas, Abagiu Sorina, o tânără scriitoare cu suflet plin de povești nerostite, simțea că începutul ei în lumea editorială era mai greu decât anticipase. Manuscrisele stăteau în sertare, visurile păreau înghesuite între pagini, iar vocea ei risca să rămână neauzită.
        </p>
        <p className='px-8 text-xl w-full font-semibold mt-2'>
            Dar Sorina nu a renunțat. În jurul ei s-au adunat prieteni cu talente diverse – meșteșugari ai codului, maeștri ai designului, exploratori ai marketingului – toți uniți de dorința de a transforma imposibilul în posibil. Împreună au construit SolarisTales, un tărâm digital magic unde fiecare scriitor, oricât de necunoscut, poate să își lanseze opera, să fie citit și să își vadă munca apreciat.
        </p>
        <p className='px-8 text-xl w-full font-semibold mt-2'>
            La SolarisTales, fiecare pagină are șansa să devină o fereastră către lumi nebănuite, iar fiecare autor descoperă că visele pot fi împărtășite cu lumea. Ce este mai special? Oricine poate păși în acest univers fără bariere: costuri minime, acces facil și oportunitatea de a câștiga un venit pasiv, în timp ce pasiunea pentru scris devine realitate.
        </p>
        <p className='px-8 text-xl w-full font-semibold mt-2'>
            Cititorii sunt invitați să se aventureze în aceste lumi misterioase, să descopere surprize și emoții ascunse, și să fie parte dintr-o comunitate unde fiecare voce contează. SolarisTales nu este doar o editură – este un loc unde magia literaturii prinde viață, unde poveștile au puterea de a inspira și de a transforma fiecare pagină într-o experiență unică.
        </p>
        <p className='px-8 text-xl w-full font-semibold mt-2'>
           Și astfel, povestea continuă, mereu deschisă către noi autori, noi cititori și noi universuri literare, într-un dans continuu între imaginație și realitate.
        </p>

        <div className='my-16 w-full'>
            <hr className="w-full border-1 border-[var(--color-primary)]/20" />
            <h1 className='text-4xl font-light italic w-full py-8 uppercase text-center'>Echipa noastra</h1>
            <hr className="w-full border-1 border-[var(--color-primary)]/20" />
        </div>

        <StaffMember member={staffMembers[0]} />
        <hr className="w-full border-1 border-[var(--color-primary)]/20 my-16" />
        <StaffMember member={staffMembers[1]} className="flex-row-reverse bg-[#FAECDF]" />
    </>
  )
}

const StaffMember = ({ member, className }) => {
    return (
        <div className={cn('w-full flex gap-8 items-center relative rounded-3xl overflow-hidden shadow-xl border-3 border-gray-200/80', className)}>
            <Image
                src={member.image}
                className="flex-1/2"
                alt={`${member.firstName} ${member.lastName}`}
            />
            <div className={cn(className ? "ml-48 text-right" : "mr-48 text-left")}>
                <h1 className='text-5xl font-bold p-0'>{member.lastName}</h1>
                <h2 className='text-3xl'>{member.firstName}</h2>

                <div className={cn('flex items-center gap-5 my-3 text-[var(--color-primary)]', className && "justify-end")}>
                    <Link href={member.socials.email}>
                        <BsEnvelope size={28} />
                    </Link>
                    <Link href={member.socials.instagram}>
                        <FaInstagram size={28} />
                    </Link>
                    <Link href={member.socials.facebook}>
                        <LuFacebook size={28} />
                    </Link>
                </div>

                <p className='text-2xl'>{member.description}</p>
                <h3 className='tracking-widest text-4xl mt-6 font-thin'>
                    {member.role}
                </h3>
            </div>
            <span className={cn('absolute text-[var(--color-primary)] text-7xl top-8', className ? "left-8" : "right-8")}>
                {member.roleIcon}
            </span>
        </div>
    )
}

export default AboutUs